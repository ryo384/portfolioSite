<?php
session_start();
$_SESSION['token'] = bin2hex(random_bytes(32));
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ポートフォリオ｜お問い合わせ</title>
    <!-- meta情報 -->
    <!-- ファビコン -->
    <!-- CSS -->
    <link rel="stylesheet" href="../common/reset.css">
    <link rel="stylesheet" href="../common/common.css">
    <link rel="stylesheet" href="style.css">
    <!-- 外部フォントやアイコン -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Sawarabi+Mincho&display=swap" rel="stylesheet">
    <!-- 必要があればjsのプリロードや非同期読み込み -->
</head>
<!-- ============================ -->
<body>
    <!-- ローディング============================ -->
    <div class="loading">
        <div class="loadingContents">
            <div class="loadingText">Welcome to<br> My Portfolio</div>
            <img class="flourish" src="../images/Flourish.png" alt="">
        </div>
    </div>
    <!-- ============================ -->
    <header>
        <div class="headerTop">
            <a class="logo" href=""><img src="https://placehold.jp/200x30.png" alt="ロゴ"></a>
            <nav class="headerNav">
                <ul>
                    <li><a href="../index.html">トップページ</a></li>
                    <li><a href="../profile/index.html">プロフィール</a></li>
                    <li><a href="index.php">コンタクト</a></li>
                </ul>
            </nav>
        </div>
        <h1>お問い合わせ</h1>
    </header>
    <!-- ============================ -->
    <div class="container">
        <main>
            <div class="outerWrap">
                <section>
                    <h2>入力フォーム</h2>
                    <form action="../app/sendMail.php" method="POST">
                        <input type="hidden" name="token" value="<?= $_SESSION['token'] ?>">
                        <div class="formItem">
                            <label for="companyName"><span>必須</span>企業名 / 団体名</label>
                            <input type="text" name="companyName" id="companyName" required placeholder="例：株式会社Example Company">
                        </div>
                        <div class="formItem">
                            <label for="userName"><span>必須</span>お名前</label>
                            <input type="text" name="userName" id="userName" required placeholder="例：田中 太郎" autocomplete="name">
                        </div>
                        <div class="formItem">
                            <label for="email"><span>必須</span>メールアドレス</label>
                            <input type="email" name="email" id="email" required placeholder="例：example@gmail.com" autocomplete="email">
                        </div>
                        <div class="formItem">
                            <label for="subject">件名</label>
                            <input type="text" name="subject" id="subject" placeholder="例：面接日程に関して">
                        </div>
                        <div class="formItem">
                            <label for="textDetail"><span>必須</span>お問い合わせ内容</label>
                            <textarea name="textDetail" id="textDetail" required placeholder="お問い合わせの詳細を記述してください"></textarea>
                        </div>
                        <div class="formSubmit">
                            <input type="submit" value="送信内容を確認する">
                        </div>
                    </form>
                </section>
            </div>
        </main>
    </div>
    <!-- ============================ -->
    <footer class="footer">
        <p class="copy"><small>©2025 Ryo Miyashita</small></p>
    </footer>
    <!-- ドロワー============================ -->
    <div class="drawerOpen">
        <button>
            <div class="flowerIcon">
                <div class="flower flower1"><span class="scale"></span></div>
                <div class="flower flower2"><span class="scale"></span></div>
                <div class="flower flower3"><span class="scale"></span></div>
                <div class="flower flower4"><span class="scale"></span></div>
                <div class="flower flower5"><span class="scale"></span></div>
            </div>
        </button>
    </div>
    <div class="drawer">
        <nav class="drawerNav">
            <ul>
                <li><a href="../index.html">トップページ</a></li>
                <li><a href="../profile/index.html">プロフィール</a></li>
                <li><a href="index.php">コンタクト</a></li>
            </ul>
        </nav>
    </div>
    <!-- ============================ -->
    <!-- クッキーの読み込み -->
    <!-- jQueryなどのライブラリ本体読み込み　→　プラグイン読み込み -->
<!-- <script src="../common/scripts/jquery-3.4.1.min.js"></script> -->
    <!-- ページ共通scriptファイルの読み込み　→　ページ固有scriptファイル読み込み-->
<script src="../common/script.js"></script>
</body>
</html>