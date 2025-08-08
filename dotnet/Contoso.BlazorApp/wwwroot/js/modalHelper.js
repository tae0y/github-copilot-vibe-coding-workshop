// modalHelper.js
window.registerEscKeyHandler = function (dotNetObjRef) {
    function escHandler(e) {
        if (e.key === "Escape") {
            dotNetObjRef.invokeMethodAsync('OnEscKey');
        }
    }
    window.addEventListener('keydown', escHandler);
    // 반환: 해제 함수
    return {
        dispose: () => window.removeEventListener('keydown', escHandler)
    };
};
