import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';

// 路由懒加载
const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const JsonFormatter = lazy(() =>
  import('./pages/JsonFormatter').then((module) => ({ default: module.JsonFormatter }))
);
const SqlFormatter = lazy(() =>
  import('./pages/SqlFormatter').then((module) => ({ default: module.SqlFormatter }))
);
const TimestampConverter = lazy(() =>
  import('./pages/TimestampConverter').then((module) => ({ default: module.TimestampConverter }))
);
const UnicodeConverter = lazy(() =>
  import('./pages/UnicodeConverter').then((module) => ({ default: module.UnicodeConverter }))
);
const CharCounter = lazy(() =>
  import('./pages/CharCounter').then((module) => ({ default: module.CharCounter }))
);
const MarkdownEditor = lazy(() =>
  import('./pages/MarkdownEditor').then((module) => ({ default: module.MarkdownEditor }))
);

const Loading = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-gray-500">加载中...</div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/json" element={<JsonFormatter />} />
            <Route path="/sql" element={<SqlFormatter />} />
            <Route path="/timestamp" element={<TimestampConverter />} />
            <Route path="/unicode" element={<UnicodeConverter />} />
            <Route path="/charcounter" element={<CharCounter />} />
            <Route path="/markdown" element={<MarkdownEditor />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
