// 프로젝트 루트에 babel.config.js 파일을 생성하거나 수정
module.exports = {
  presets: [
    [
      "next/babel",
      {
        "styled-jsx": {},
        "class-properties": {},
        emotion: {
          hoist: true,
        },
        "styled-components": {
          ssr: true,
        },
      },
    ],
  ],
  plugins: [["@babel/plugin-transform-typescript", { "is  TSX": true }]],
};
