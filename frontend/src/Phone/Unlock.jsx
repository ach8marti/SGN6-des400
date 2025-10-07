import "./Phone.css"; // your CSS file that includes the snippet you shared + the styles above

export default function LockScreenUI() {
    return (
      <div className="lock-page">
        {/* LEFT: Phone */}
        <div className="lock-phone" aria-label="Phone lock screen">
          <div
            className="lock-phone-screen"
            style={{ backgroundImage: "url('/pics/Wallpaper.jpg')" }}
          >
            {/* Header + fixed dots */}
            <div className="passcode-wrap">
              <div className="passcode-title">Enter Passcode</div>
              <div className="passcode-dots" aria-hidden="true">
               <span className="dot" />
               <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
  
            {/* Static numpad */}
            <div className="numpad" aria-hidden="true">
              <div className="key">1</div>
              <div className="key">2</div>
              <div className="key">3</div>
              <div className="key">4</div>
              <div className="key">5</div>
              <div className="key">6</div>
              <div className="key">7</div>
              <div className="key">8</div>
              <div className="key">9</div>
              <div /> {/* spacer */}
              <div className="key zero">0</div>
              <div className="key small">Delete</div>
            </div>
  
          </div>
        </div>
  
        {/* RIGHT side box you already have */}
        <div className="lock-text-box" />
  
      </div>
    );
  }
  