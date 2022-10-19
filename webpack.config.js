const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const getAbsolutePath = pathDir => path.resolve(__dirname, pathDir);

module.exports = {
  // js 파일의 진입점과 빌드한 파일을 저장할 경로. babel polyfill 추가하여 레거시 지원하도록 함
  entry: './src/index.js',
  output: {
    filename: 'js/main.js',
    path: getAbsolutePath('dist'),
    publicPath: '/',
  },
  // 빌드 방법. development / production
  // development가 코드를 알아보기 쉽고 더 빠르지만 성능상 비효율적
  mode: 'development',
  plugins: [
    // html 자동 주입 플러그인
    // 실제 작성하는 html에 script 태그를 직접 작성할 필요 없음
    // hash가 포함된 이름을 알아서 잘 인식하고 불러옴
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    // 컴파일된 CSS를 별도의 CSS 파일로 분리한다
    new MiniCssExtractPlugin({
      filename: 'dist/css/[name].[contenthash:8].css',
      chunkFilename: 'dist/css/[name].[contenthash:8].chunk.css',
    }),
  ],
  module: {
    rules: [
      // js 번들링 옵션
      // babel 이용하여 트랜스파일링한 뒤 번들링하도록함
      {
        test: /\.js$/,
        include: [getAbsolutePath('src/js')],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
                {
                  corejs: 3,
                  proposals: true,
                },
              ],
            ],
          },
        },
      },
      // CSS module을 위한 속성
      // 일반 css 파일과 module.css 파일을 구분하여 처리
      {
        test: /\.css$/i,
        exclude: /\.module\.css$/i, // 모듈 파일 제외 설정
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.module\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
      // Asset Modules를 이용한 폰트 내보내기
      // 로더를 추가로 구성하지 않아도 사용 가능 (webpack 5+)
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]',
        },
      },
    ],
  },
  // 한 번에 모든 코드를 다 불러오지 않고 필요한 부분만 부분적으로 불러오게 하는 속성
  // 정확한 동작원리는 아직 모름
  devtool: 'cheap-module-source-map',
  // webpack-dev-server 관련 속성
  // 로컬 서버에서 라우팅 처리가 필요해서 사용하지 않기로 함

  // devServer: {
  //   open: true,
  //   // 정적 파일을 찾는 위치
  //   static: {
  //     directory: path.join(__dirname, '/dist'),
  //   },
  //   // 서버 통신 시 CORS를 통과하기 위한 프록시 설정
  //   proxy: [
  //     {
  //       context: ['/api', '/auth'], // can have multiple
  //       target: 'http://localhost:5004', // 서버 주소
  //       secure: false,
  //     },
  //   ],
  //   port: 3000, // webpack-dev-server가 사용할 포트, 기본값 8080
  //   client: {
  //     overlay: {
  //       // Shows a full-screen overlay in the browser when there are compiler errors or warnings
  //       warnings: false, // defaults to false
  //       errors: false, // defaults to false
  //     },
  //   },
  // },
};
