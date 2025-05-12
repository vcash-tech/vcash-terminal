const ffi = require('ffi-napi');
const ref = require('ref-napi');
const Struct = require('ref-struct-napi');

// --- Configuration ---
// IMPORTANT: Adjust this path if the DLL is not in the same directory
const DLL_PATH = './UsbConsumerPrnDevDLL.dll'; // Use absolute path if needed, e.g., 'C:/path/to/UsbConsumerPrnDevDLL.dll'

// --- Define Constants (Based on Manual Pages 3-7 & 10) ---
const SUCCESS = 0;
const FAIL = 1;
// Add more specific status/error codes from pages 3-6 if needed for detailed checks
const T542PRNDEVOK = 1300; // Normal status code example

// --- Define C Structures (Based on Manual Pages 7, 8, 9) ---

// tDevReturn (Page 7) - Crucial for getting status/error feedback
const TDevReturn = Struct({
    iLogicCode: ref.types.int,      // Logical error code
    iPhyCode: ref.types.int,        // Physical error code from device
    iHandle: ref.types.int,         // Processing method hint (0:None, 1:Init, 2:Reissue) - or maybe device handle? Manual unclear.
    iType: ref.types.int,           // Error type (0: Warning, 1: Serious)
    // Using Buffer for fixed-size char arrays. Needs decoding to read as string.
    acDevReturn: Buffer.alloc(128), // Hardware return information string (raw)
    acReserve: Buffer.alloc(128)    // Reserved
});
const TDevReturnPtr = ref.refType(TDevReturn); // Pointer type for tDevReturn*

// Note: tPrintContent, tPrintContentEx, tPrintPara are not strictly needed
// for this simple iPrintStrEx example, but would be defined similarly if using iPrint/iPrintEx.

// --- Load the DLL and Define Function Signatures ---

let printerLib;
try {
    printerLib = ffi.Library(DLL_PATH, {
        // --- Core Functions ---
        'iInit': ['int', [TDevReturnPtr]], // int iInit(tDevReturn* p_psStatus); (Page 25)
        'iGetStatus': ['int', [TDevReturnPtr]], // int iGetStatus(tDevReturn* p_psStatus); (Page 24)
        'iCloseComm': ['int', [TDevReturnPtr]], // int iCloseComm(tDevReturn* p_psStatus); (Page 47 / Implicit from page 11)

        // --- Printing & Cutting ---
        // int iPrintStrEx(UINT p_iX, const char* p_pcData, tDevReturn* p_psStatus, unsigned char p_ucFirst_Line=0); (Page 33)
        // Note: We need to provide all args even if C++ has defaults
        'iPrintStrEx': ['int', ['uint', 'string', TDevReturnPtr, 'uchar']],
        'iCutRight': ['int', [TDevReturnPtr]], // int iCutRight (tDevReturn* p_psStatus); (Page 16)

        // Add other functions here as needed, e.g.:
        // 'iCut': ['int', [TDevReturnPtr]],
        // 'iPrint': ['int', [/* tPrintContent* */ 'void*', 'int', TDevReturnPtr]], // Need tPrintContent definition
        // 'iBmpFilePrint': ['int', ['int', 'int', 'string', TDevReturnPtr, 'int']], // (Page 12) - simplified arg types
    });
} catch (e) {
    console.error(`Error loading DLL from path: ${DLL_PATH}`);
    console.error("Please ensure:");
    console.error("1. The DLL exists at the specified path.");
    console.error("2. The DLL is compatible with your Node.js architecture (e.g., x64).");
    console.error("3. You have necessary C++ Redistributables installed if required by the DLL.");
    console.error("4. Any dependent DLLs are also accessible.");
    console.error("FFI Error:", e);
    process.exit(1); // Exit if DLL can't be loaded
}

// --- Helper Function to Check Status ---
function checkStatus(functionName, resultCode, statusStruct) {
    const logicCode = statusStruct.iLogicCode;
    const phyCode = statusStruct.iPhyCode;
    const errorType = statusStruct.iType; // 0: Warning, 1: Serious
    // Decode the raw return string (assuming null-terminated ASCII/UTF-8 - adjust if needed)
    const rawReturn = ref.readCString(statusStruct.acDevReturn, 0);

    console.log(`--- ${functionName} ---`);
    console.log(`  Direct Return: ${resultCode === SUCCESS ? 'SUCCESS (0)' : `FAIL (${resultCode})`}`);
    console.log(`  Logic Code: ${logicCode} ${logicCode === T542PRNDEVOK ? '(OK)' : '(Check Manual)'}`);
    console.log(`  Physical Code: ${phyCode}`);
    console.log(`  Error Type: ${errorType === 0 ? 'Warning' : (errorType === 1 ? 'Serious' : 'Unknown')}`);
    console.log(`  Raw Device Return: '${rawReturn}'`);

    // Determine overall success/failure based on both direct return and logic code
    // Treat serious errors or non-zero direct returns as failure for this example
    if (resultCode !== SUCCESS || (logicCode !== T542PRNDEVOK && errorType === 1)) { // Assuming T542PRNDEVOK is the main OK code
        console.error(`*** ${functionName} failed! ***`);
        return false;
    }
    // Allow warnings (errorType 0) but log them
    if (logicCode !== T542PRNDEVOK && errorType === 0) {
         console.warn(`*** ${functionName} reported a warning (Logic Code: ${logicCode}) ***`);
    }

    return true;
}


// --- Main Printing Logic ---
async function runPrintTest() {
    // Create an instance of the tDevReturn struct to pass to functions
    const status = new TDevReturn();
    let overallSuccess = true;

    try {
        // 1. Initialize Printer
        let result = printerLib.iInit(status.ref());
        if (!checkStatus('iInit', result, status.deref())) {
            overallSuccess = false;
            throw new Error("Initialization failed. Cannot proceed."); // Stop if init fails
        }

        // Optional: Check status explicitly after init
        result = printerLib.iGetStatus(status.ref());
         if (!checkStatus('iGetStatus (after init)', result, status.deref())) {
            // Decide if you want to stop on warnings here
            if (status.deref().iType === 1) { // Stop only on serious errors
                 overallSuccess = false;
                 throw new Error("GetStatus reported serious error after init.");
            }
        }

        // 2. Print some text using iPrintStrEx (doesn't cut automatically)
        console.log("\nAttempting to print...");
        const textToPrint = "Hello from Node.js using FFI!\nTesting Line 2.\n\n";
        const startColumnX = 0; // Starting X position (column) - units depend on printer/config
        const firstLineFeedMM = 0; // Feed before printing (usually 0) - type is uchar

        result = printerLib.iPrintStrEx(startColumnX, textToPrint, status.ref(), firstLineFeedMM);
        if (!checkStatus('iPrintStrEx', result, status.deref())) {
           // Log failure but might try to continue to cut/close
           overallSuccess = false;
        } else {
             console.log("Print command sent successfully (check printer).");
        }

       // Add a small delay - sometimes needed for hardware operations
        await new Promise(resolve => setTimeout(resolve, 500));

        // 3. Cut the paper
        console.log("\nAttempting to cut paper...");
        result = printerLib.iCutRight(status.ref()); // Immediate cut
         if (!checkStatus('iCutRight', result, status.deref())) {
            overallSuccess = false;
        } else {
             console.log("Cut command sent successfully.");
        }

    } catch (e) {
        console.error("\n--- Runtime Error During Print Test ---");
        console.error(e);
        overallSuccess = false; // Mark as failed on error
    } finally {
        // 4. Close Communication (ALWAYS attempt this)
        console.log("\nAttempting to close communication...");
        // Re-use the status struct or create a new one
        const closeStatus = new TDevReturn();
        const closeResult = printerLib.iCloseComm(closeStatus.ref());
        // Check status for close, but don't let it override earlier failures
        checkStatus('iCloseComm', closeResult, closeStatus.deref());
        if (closeResult !== SUCCESS) {
             console.error("*** Failed to close communication properly. ***");
             // Don't set overallSuccess=false here if printing worked but close failed
        } else {
             console.log("Communication closed.");
        }
    }

     console.log(`\n--- Test Complete ---`);
     console.log(`Overall Success Status: ${overallSuccess ? 'PASSED (Commands sent without critical errors)' : 'FAILED (Check logs for details)'}`);
}

// --- Run the test ---
runPrintTest();
