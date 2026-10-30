import katex from "katex";
export default function Formula({ value }: { value: string }) {
  return (
    <div
      className="formula"
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(value, {
          displayMode: true,
          throwOnError: false,
          output: "htmlAndMathml",
        }),
      }}
    />
  );
}
