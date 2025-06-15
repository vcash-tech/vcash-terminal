export default function Container({ children, isFullHeight }: { children: React.ReactNode, isFullHeight?: boolean }) {
  return <div className={`container ${isFullHeight ? 'full-height' : ''}`}>{children}</div>;
}