export function LambdaMark() {
  return (
    <svg
      className="lambda-mark"
      viewBox="0 0 280 290"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M29 0H80C109 0 126 15 138 42L157 96L54 272H0L110 96L96 59Q92 29 70 29H29Z"
        fill="var(--paper)"
      />
      <path
        d="M165 114L211 234C222 259 245 240 242 223C240 211 234 204 224 202C256 195 282 223 277 249C273 278 238 289 210 278C190 273 181 256 175 240L139 167Z"
        fill="var(--teal)"
      />
    </svg>
  );
}

export function Wordmark({ size }: { size?: number }) {
  return (
    <span className="wordmark-wrap" style={size ? { fontSize: size } : undefined}>
      <LambdaMark />
      <span className="wordmark">
        Lamd<span className="i-teal">i</span><span style={{ color: "var(--teal)" }}>x</span>
      </span>
    </span>
  );
}

export function Logo() {
  return <Wordmark />;
}
