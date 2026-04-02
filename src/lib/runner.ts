// iframe sandbox を使ってユーザーのコードを安全に実行する

export interface RunResult {
  output: string[];   // console.log の出力一覧
  error: string | null;
}

export function runCode(code: string): Promise<RunResult> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const timeout = setTimeout(() => {
      cleanup();
      resolve({ output: [], error: "タイムアウト：処理が5秒以内に完了しませんでした" });
    }, 5000);

    function cleanup() {
      clearTimeout(timeout);
      window.removeEventListener("message", onMessage);
      document.body.removeChild(iframe);
    }

    function onMessage(event: MessageEvent) {
      if (event.data?.type !== "run-result") return;
      cleanup();
      resolve({ output: event.data.output, error: event.data.error });
    }

    window.addEventListener("message", onMessage);

    // iframe 内に注入する HTML
    // console.log を上書きして出力を postMessage で親に送る
    const html = `
      <script>
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(a => JSON.stringify(a)).join(" "));
        };

        try {
          ${code}
          // 非同期コードが完了するのを待つ（最大5秒）
          Promise.resolve().then(() => {
            setTimeout(() => {
              parent.postMessage({ type: "run-result", output: logs, error: null }, "*");
            }, 0);
          });
        } catch (e) {
          parent.postMessage({ type: "run-result", output: logs, error: e.message }, "*");
        }
      <\/script>
    `;

    const blob = new Blob([html], { type: "text/html; charset=utf-8" });
    iframe.src = URL.createObjectURL(blob);
  });
}

// 期待値と出力結果を比較する
// console.log が複数行あった場合は全行を改行で結合して比較
export function judge(output: string[], expected: string): boolean {
  const actual = output.join("\n").trim();
  return actual === expected.trim();
}
