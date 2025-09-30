import Footer from '../components/Footer';
import Header from '../components/Header';
import ChannelIdInput from '../components/ChannelIdInput';
import UsageGuide from '../components/UsageGuide';
import SampleSection from '../components/SampleSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="アナリティクス" />

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ChannelIdInput />
        <UsageGuide />
        <SampleSection />
      </main>

      <Footer />
    </div>
  );
}