document.addEventListener("DOMContentLoaded", function() {
    const searchForm = document.getElementById('searchForm');
    const keywordInput = document.getElementById('keywordInput');

    // 在表單提交前，將關鍵字轉換為 URI 編碼，以便在 URL 中使用
    searchForm.addEventListener('submit', function(event) {
        const keyword = keywordInput.value.trim();
        console.log(keyword);
        if (keyword !== '') {
            const encodedKeyword = encodeURIComponent(keyword);
            const searchURL = `https://www.dcard.tw/search?query=${encodedKeyword}`;
            window.location.href = searchURL; // 手動提交表單
        } else {
            // 如果關鍵字為空，阻止表單提交
            event.preventDefault();
            alert('請輸入關鍵字');
        }
    });
});