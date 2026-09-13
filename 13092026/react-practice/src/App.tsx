import Accordion from "./components/Accordion";
import "./App.css";
function App() {
  return (
    <div className="container">
      <h1>Accordion</h1>

      <Accordion defaultValue="react">
        <Accordion.Item value="react">
          <Accordion.Trigger value="react">React là gì?</Accordion.Trigger>

          <Accordion.Content value="react">
            React là thư viện JavaScript dùng để xây dựng giao diện người dùng.
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="nextjs">
          <Accordion.Trigger value="nextjs">Next.js là gì?</Accordion.Trigger>

          <Accordion.Content value="nextjs">
            Next.js là framework xây dựng ứng dụng React.
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item value="typescript">
          <Accordion.Trigger value="typescript">
            TypeScript là gì?
          </Accordion.Trigger>

          <Accordion.Content value="typescript">
            TypeScript là JavaScript có thêm hệ thống kiểu.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default App;
