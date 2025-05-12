#include <windows.h> // Essential for LoadLibrary, GetProcAddress, etc.
#include <stdio.h>   // For printf
#include <stdbool.h> // For bool type (optional, could use BOOL)

// --- Define Constants ---
#define SUCCESS 0
#define FAIL 1
#define T542PRNDEVOK 1300 // Normal status code example

// --- Define tDevReturn Structure (matching the manual/JS example) ---
typedef struct {
    int iLogicCode;
    int iPhyCode;
    int iHandle; // Usage unclear from manual, treat as informational
    int iType;   // 0: Warning, 1: Serious
    char acDevReturn[128];
    char acReserve[128];
} tDevReturn;

// --- Define Function Pointer Types for DLL functions ---
// Match the signatures from the documentation/JS example
typedef int (*IInitFunc)(tDevReturn* p_psStatus);
typedef int (*IGetStatusFunc)(tDevReturn* p_psStatus);
typedef int (*IPrintStrExFunc)(UINT p_iX, const char* p_pcData, tDevReturn* p_psStatus, unsigned char p_ucFirst_Line);
typedef int (*ICutRightFunc)(tDevReturn* p_psStatus);
typedef int (*ICloseCommFunc)(tDevReturn* p_psStatus);

// --- Helper Function to Print Status ---
bool checkStatus(const char* functionName, int resultCode, tDevReturn* statusStruct) {
    printf("--- %s ---\n", functionName);
    printf("  Direct Return: %s (%d)\n", (resultCode == SUCCESS ? "SUCCESS" : "FAIL"), resultCode);
    if (statusStruct) {
        printf("  Logic Code: %d %s\n", statusStruct->iLogicCode, (statusStruct->iLogicCode == T542PRNDEVOK ? "(OK)" : "(Check Manual)"));
        printf("  Physical Code: %d\n", statusStruct->iPhyCode);
        printf("  Error Type: %s (%d)\n", (statusStruct->iType == 0 ? "Warning" : (statusStruct->iType == 1 ? "Serious" : "Unknown")), statusStruct->iType);
        // Ensure null termination before printing string buffer
        statusStruct->acDevReturn[sizeof(statusStruct->acDevReturn) - 1] = '\0';
        printf("  Raw Device Return: '%s'\n", statusStruct->acDevReturn);

        // Determine overall success/failure
        if (resultCode != SUCCESS || (statusStruct->iLogicCode != T542PRNDEVOK && statusStruct->iType == 1)) {
             fprintf(stderr, "*** %s failed! ***\n", functionName);
             return false;
        }
        if (statusStruct->iLogicCode != T542PRNDEVOK && statusStruct->iType == 0) {
             printf("*** %s reported a warning (Logic Code: %d) ***\n", functionName, statusStruct->iLogicCode);
        }
    } else if (resultCode != SUCCESS) {
         fprintf(stderr, "*** %s failed (no status struct)! ***\n", functionName);
         return false;
    }
     return true;
}


int main() {
    HINSTANCE hDll = NULL;
    IInitFunc iInit = NULL;
    IGetStatusFunc iGetStatus = NULL;
    IPrintStrExFunc iPrintStrEx = NULL;
    ICutRightFunc iCutRight = NULL;
    ICloseCommFunc iCloseComm = NULL;

    tDevReturn status;
    int result;
    bool overallSuccess = true;

    // --- 1. Load the DLL ---
    // Assumes DLL is in the same directory or in PATH
    printf("Loading ConsumerPrnDevDLL.dll...\n");
    hDll = LoadLibrary("ConsumerPrnDevDLL.dll");
    if (hDll == NULL) {
        fprintf(stderr, "!!! Failed to load ConsumerPrnDevDLL.dll. Error code: %lu\n", GetLastError());
        fprintf(stderr, "Ensure the DLL is in the same directory as this executable.\n");
        return 1; // Exit if DLL can't be loaded
    }
     printf("DLL loaded successfully.\n");

    // --- 2. Get Function Pointers ---
     printf("Getting function addresses...\n");
    iInit = (IInitFunc)GetProcAddress(hDll, "iInit");
    iGetStatus = (IGetStatusFunc)GetProcAddress(hDll, "iGetStatus");
    iPrintStrEx = (IPrintStrExFunc)GetProcAddress(hDll, "iPrintStrEx");
    iCutRight = (ICutRightFunc)GetProcAddress(hDll, "iCutRight");
    iCloseComm = (ICloseCommFunc)GetProcAddress(hDll, "iCloseComm");

    // Check if all functions were found
    if (!iInit || !iGetStatus || !iPrintStrEx || !iCutRight || !iCloseComm) {
        fprintf(stderr, "!!! Failed to get one or more function addresses from the DLL.\n");
        if (!iInit) fprintf(stderr, "    Could not find iInit\n");
        if (!iGetStatus) fprintf(stderr, "    Could not find iGetStatus\n");
        if (!iPrintStrEx) fprintf(stderr, "    Could not find iPrintStrEx\n");
        if (!iCutRight) fprintf(stderr, "    Could not find iCutRight\n");
        if (!iCloseComm) fprintf(stderr, "    Could not find iCloseComm\n");
        FreeLibrary(hDll);
        return 1;
    }
     printf("All required functions found.\n\n");

    // --- 3. Initialize Printer ---
    result = iInit(&status);
    if (!checkStatus("iInit", result, &status)) {
        overallSuccess = false;
        fprintf(stderr, "Initialization failed. Exiting.\n");
        // Attempt to close even if init failed
        if(iCloseComm) iCloseComm(&status); // Use a fresh status or ignore return here
        FreeLibrary(hDll);
        return 1;
    }

    // --- 4. Print Text ---
     printf("\nAttempting to print...\n");
    const char* textToPrint = "Hello from C Program!\nTesting Line 2.\n\n";
    UINT startColumnX = 0;
    unsigned char firstLineFeed = 0; // Explicitly setting the default value

    result = iPrintStrEx(startColumnX, textToPrint, &status, firstLineFeed);
    if (!checkStatus("iPrintStrEx", result, &status)) {
        overallSuccess = false; // Log failure but continue to cut/close
    } else {
         printf("Print command sent successfully (check printer).\n");
    }

    // Optional small delay - might help ensure print buffer is flushed before cut
    Sleep(500); // Sleep for 500 milliseconds

    // --- 5. Cut Paper ---
     printf("\nAttempting to cut paper...\n");
    result = iCutRight(&status);
    if (!checkStatus("iCutRight", result, &status)) {
        overallSuccess = false;
    } else {
         printf("Cut command sent successfully.\n");
    }

    // --- 6. Close Communication ---
     printf("\nAttempting to close communication...\n");
    result = iCloseComm(&status); // Can re-use status struct
    if (!checkStatus("iCloseComm", result, &status)) {
         // Log failure, but don't necessarily mark the whole test as failed if printing worked
         fprintf(stderr, "*** Warning: Failed to close communication properly. ***\n");
    } else {
         printf("Communication closed.\n");
    }

    // --- 7. Unload DLL ---
     printf("\nUnloading DLL...\n");
    FreeLibrary(hDll);

     printf("\n--- C Test Complete ---\n");
     printf("Overall Status: %s\n", overallSuccess ? "PASSED (Commands sent without critical errors)" : "FAILED (Check logs for details)");

    return overallSuccess ? 0 : 1; // Return 0 on success, 1 on failure
}
