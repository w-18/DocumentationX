import Card from "@/components/guideCard";

const App = () => {
  return (
    <div className="items-center justify-center rounded-lg shadow-lg grid mt-10">
      <Card
        title="Clone Repository"
        content="Clone the bot's source code from GitHub: <br> <strong> a </strong><script> console.log('GET HACKED HAHA')</script>"
        state="none"
      />

      <Card
        title="Configure config.json"
        content="Create and modify the configuration file:"
        state="warning"
      />

      <Card
        title="Set Up .env File"
        content="Create environment variables for sensitive data:"
        state="danger"
      />

      <Card
        title="Install & Run"
        content="Install dependencies and start the bot:"
        state="note"
      />
    </div>
  );
};

export default App;