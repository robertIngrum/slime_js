import express from "express";
import path from "path";
import webpack from "webpack";

const compiler = webpack({
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'eval-cheap-module-source-map',
});

const watching = compiler.watch({
  aggregateTimeout: 300,
  poll: undefined,
}, (err, stats) => {
  compiler.close((closeErr) => {});
});

const app  = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "dist")));

app.get("/", (req, res) => {
  res.render("index", { path: req.path });
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
