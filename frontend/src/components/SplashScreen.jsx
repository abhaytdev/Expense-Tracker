import Logo3D from './Logo3D';
import '../styles/splash.css';

export default function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <Logo3D size={110} animated />
        <h1 className="splash-title">Expense Tracker</h1>
        <p className="splash-subtitle">Track smarter. Spend better.</p>
        <div className="splash-loader" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
