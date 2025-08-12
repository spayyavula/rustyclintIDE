import { Zap } from 'lucide-react';

export default function IconTest() {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <h2>Lucide Icon Test</h2>
      <Zap size={48} color="blue" />
      <div style={{ marginTop: 8 }}>If you see a blue lightning icon above, lucide-react is working!</div>
    </div>
  );
}
