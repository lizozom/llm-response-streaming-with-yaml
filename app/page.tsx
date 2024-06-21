import StreamLlmData from './components/StreamLlmData';

const HomePage = () => {
  return (
    <div className="p-4">
      <StreamLlmData targetNumber={20} />
    </div>
  );
};

export default HomePage;
