 

import { useEffect } from "react";

import Login from "../../pages/Login";
import Register from "../../pages/Register";

/**
 * Popup modal for Login and Register.
 *
 * Props:
 * - mode: "login" | "register" | null
 * - onModeChange(mode)
 * - onClose()
 */
const AuthModal = ({ mode, onModeChange, onClose }) => {
  const isOpen = Boolean(mode);

  // Close modal with Escape and lock background scrolling.
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.classList.add("modal-open");

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="modal d-block lp-modal"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) =>
          event.target === event.currentTarget && onClose()
        }
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content lp-modal-content">
            <div className="modal-header border-0 pb-0">
              <div className="d-flex align-items-center gap-2">
                <span className="cw-brand-mark">
                  <i className="bi bi-chat-dots-fill" />
                </span>

                <span className="cw-brand-word">Chat App</span>
              </div>

              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>

            <div className="modal-body px-4 pb-4 pt-2">
              {mode === "login" ? (
                <Login
                  key="login"
                  onSwitchToRegister={() =>
                    onModeChange("register")
                  }
                />
              ) : (
                <Register
                  key="register"
                  onSwitchToLogin={() =>
                    onModeChange("login")
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop show lp-backdrop" />
    </>
  );
};

export default AuthModal;
