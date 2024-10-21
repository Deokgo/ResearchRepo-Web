import React, { createContext, useState, useContext } from "react";

const ModalContext = createContext();
export const useModalContext = () => {
  return useContext(ModalContext);
};
export const ModalProvider = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isPassresetModalOpen, setIsPassresetModalOpen] = useState(false);
  const [isAddPaperModalOpen, setIsAddPaperModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);
  const openPassresetModal = () => setIsPassresetModalOpen(true);
  const closePassresetModal = () => setIsPassresetModalOpen(false);
  const openAddPaperModal = () => setIsAddPaperModalOpen(true);
  const closeAddPaperModal = () => setIsAddPaperModalOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        isSignupModalOpen,
        openSignupModal,
        closeSignupModal,
        isPassresetModalOpen,
        openPassresetModal,
        closePassresetModal,
        isAddPaperModalOpen,
        closeAddPaperModal,
        openAddPaperModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
