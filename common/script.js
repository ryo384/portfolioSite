'use strict';

// ローディング
document.body.classList.add('noScroll');
const loadWindow = document.querySelector('.loading')
const loadAnimation = document.querySelector('.loading .flourish');
loadAnimation.addEventListener('animationend', function() {
    document.body.classList.remove('noScroll');
    loadWindow.classList.add('loaded');
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            loadWindow.addEventListener('animationend', function() {
                loadWindow.style.display = 'none';
            });
        });
    });
});


// ドロワー
document.querySelector('.drawerOpen').addEventListener('click', function() {
    // document.querySelector('.drawer').classList.toggle('show');

    const drawerList = document.querySelectorAll('.drawer ul li');
    let i = 0;
    const delay = setInterval(function() {
        drawerList[i].classList.toggle('show');
        // drawerList[i].style.display = 'block';
        i++;
        if(i >= drawerList.length) {
            clearInterval(delay);  
        }
    }, 50);
});



// セクションフェード
const sections = document.querySelectorAll('section');
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('sectionFadeIn');
        });
    }, { threshold: 0.1 });

    sections.forEach((sec) => observer.observe(sec));
} else {
    sections.forEach((sec) => sec.classList.add('show'));
}



document.addEventListener('DOMContentLoaded', () => {
    setUpAccordion();
});

const setUpAccordion = () => {
    const details = document.querySelectorAll('details');
    const RUNNING_VALUE = 'running';
    const IS_OPENED_CLASS = 'is-opened';

    details.forEach((element) => {
        const summary = element.querySelector('summary');
        const content = element.querySelector('.itemWrap');

        // Promiseを返す closeAccordion
        const closeAccordion = (el, cont) => {
            return new Promise((resolve) => {
                el.classList.remove(IS_OPENED_CLASS); // toggleよりremoveの方が確実

                const closingAnim = cont.animate(closingAnimKeyframes(cont), animTiming);
                el.dataset.animStatus = RUNNING_VALUE;

                closingAnim.onfinish = () => {
                    el.removeAttribute('open');
                    el.dataset.animStatus = '';
                    resolve(); // アニメーション完了を通知
                };
            });
        };

        summary.addEventListener('click', async (event) => {
            event.preventDefault();

            if (element.dataset.animStatus === RUNNING_VALUE) {
                return;
            }

            if (element.open) {
                // 自分を閉じるだけ
                await closeAccordion(element, content);
            } else {
                // 全て閉じる（並列で実行して完了を待つ）
                await Promise.all(
                    Array.from(details).map(d => {
                        if (d.open) {
                            const c = d.querySelector('.itemWrap');
                            return closeAccordion(d, c);
                        }
                    }).filter(Boolean) // undefined を除外
                );

                // 自分を開く
                element.setAttribute('open', 'true');
                element.classList.add(IS_OPENED_CLASS);

                const openingAnim = content.animate(openingAnimKeyframes(content), animTiming);
                element.dataset.animStatus = RUNNING_VALUE;

                openingAnim.onfinish = () => {
                    element.dataset.animStatus = '';
                };
            }
        });
    });
};


/**
 * アニメーションの時間とイージング
 */
const animTiming = {
    duration: 400,
    easing: 'ease-out'
};

/**
 * アコーディオンを閉じるときのキーフレームを作成します。
 * @param content {HTMLElement}
 */
const closingAnimKeyframes = (content) => [
    {
        height: content.offsetHeight + 'px', // height: 'auto'だとうまく計算されないため要素の高さを指定する
        opacity: 1,
    }, {
        height: 0,
        opacity: 0,
    }
];

/**
 * アコーディオンを開くときのキーフレームを作成します。
 * @param content {HTMLElement}
 */
const openingAnimKeyframes = (content) => [
    {
        height: 0,
        opacity: 0,
    }, {
        height: content.offsetHeight + 'px',
        opacity: 1,
    }
];




// 768px以上になったらイベント発生
const mediaQuery = window.matchMedia('(min-width: 768px)');
const skillsDetails = document.querySelectorAll('.skills details');
// 初回チェック
    if (mediaQuery.matches) { /* 768px以上 */
        skillsDetails.forEach((element) => {
            element.open = true;
        });
} else {
    if (mediaQuery.matches) { /* 768px以上 */
        skillsDetails.forEach((element) => {
            element.open = false;
        });
    }
}

// 状態が変化したとき（768pxをまたいだ時）にイベント発火
mediaQuery.addEventListener('change', (e) => {
    if (e.matches) { /* 768以上 */
        skillsDetails.forEach((element) => {
            element.open = true;
        });
    } else {
        skillsDetails.forEach((element) => {
            element.open = false;
        });
    }
});
// ～～～アコーディオンメニュー




// トップページ用処理
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    if (body.classList.contains('home')) {
        const canvas = document.getElementById('rainCanvas');
        const ctx = canvas.getContext('2d');


        // 雨アニメーション
        // 画面サイズをキャンバスに合わせる
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // ウィンドウサイズ変更時もリサイズ
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // 雨粒クラス
        class Raindrop {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;  // X位置
                this.y = Math.random() * -canvas.height; // 画面上からランダム開始
                this.length = 10 + Math.random() * 20; // 長さ
                this.speed = 4 + Math.random() * 6;    // 落下速度
                this.opacity = 0.2 + Math.random() * 0.5; // 透明度
            }

            update() {
                this.y += this.speed;
                if (this.y > canvas.height) {
                this.reset(); // 下に落ちたら上に戻す
                }
            }

            draw() {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255,255,255,${this.opacity})`;
                ctx.lineWidth = 1;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x, this.y + this.length);
                ctx.stroke();
            }
        }

        // 雨粒を大量生成
        const raindrops = [];
        const rainCount = 1000; // 雨粒の数
        let activeRainCount = rainCount; // 現在描画している雨粒数

        for (let i = 0; i < rainCount; i++) {
            raindrops.push(new Raindrop());
        }


        // 雨が止むまでの時間（ミリ秒）
        const stopDuration = 10000; // 30秒かけて雨が止む
        const startTime = Date.now();

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 経過時間に応じて描画数を減らす
            const elapsed = Date.now() - startTime;
            const ratio = Math.max(0, 1 - elapsed / stopDuration); // 1→0に減少
            activeRainCount = Math.floor(rainCount * ratio);

            for (let i = 0; i < activeRainCount; i++) {
                raindrops[i].update();
                raindrops[i].draw();
            }

            // 雨が完全に止んだらアニメーションを停止
            if (activeRainCount > 0) {
                requestAnimationFrame(animate);
            } else { //背景を切り替える
                changeBg('url("images/rainbowSky.jpg")');
            }
        }
        animate();
        // ～～雨



        //ヘッダーのバックグラウンド切り替え
        function changeBg(afterImg) {
            const headerImage = document.querySelector('header');
            headerImage.style.setProperty('--after-bg', afterImg);
            void headerImage.offsetWidth;
            headerImage.classList.add('fadeIn');
            setTimeout(() => {
                headerImage.style.setProperty('--bg', afterImg);
                headerImage.classList.remove('fadeIn');
                headerImage.style.setProperty('--after-bg', 'none');
            }, 5000);
        }

        (function() {
            let i = 0;
            const bgInterval = setInterval(() => {
                if (i >= 20) {
                    clearInterval(bgInterval); // 20回実行したら停止
                    return;
                }

                if ((i % 2) === 1) {
                    changeBg('url("images/rainbowSky.jpg")');
                } else {
                    changeBg('url("images/mainImageIris.jpg")');
                }
                i++;
            }, 40000); // 40秒ごとに実行
        })(); // 関数を定義後、すぐに実行
        // ～～バックグラウンド


        // モーダル
        const modalOpenBtn = document.querySelector('.modalOpen');
        const modalCloseBtn = document.querySelector('.modalClose');
        const modalLayer = document.querySelector('.modalLayer');
        const modalContent = document.querySelector('.modal');
        modalOpenBtn.addEventListener('click', function(){
            modalLayer.classList.add('open');
            document.body.classList.add('modalScrollOff');
        });
        modalCloseBtn.addEventListener('click', () => {
            modalLayer.classList.remove('open');
            document.body.classList.remove('modalScrollOff');
        });
        modalLayer.addEventListener('click', (event) => {
            if(!modalContent.contains(event.target)) {
                modalLayer.classList.remove('open');
                document.body.classList.remove('modalScrollOff');
            }
        });

        // タブ切り替え
        const skillTabRadios = document.querySelectorAll('.tabChange div input');
        const skillTabs = document.querySelectorAll('.modalPanel .tab');
        skillTabRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                skillTabs.forEach(tab => {
                    tab.classList.remove('active')
                });
                const tabTarget = document.getElementById(radio.value);
                tabTarget.classList.add('active');
            });
        });
        // ～～モーダル

    }
});



