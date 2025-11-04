<?php
session_start();
mb_language("Japanese");
mb_internal_encoding("UTF-8");

// ======================================================
// 設定
// ======================================================
$adminEmail = "ryo38study519@gmail.com"; // 管理者メールアドレス（自分の宛先に変更）
$fromDomain = "sv11010.star.ne.jp";       // 送信元ドメイン
$siteName   = "ポートフォリオサイト"; // サイト名（自動返信で使用）

// ======================================================
// CSRF対策（トークン確認）
// ======================================================
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    exit("不正なアクセスです。");
}
if (!isset($_SESSION['token']) || $_POST['token'] !== $_SESSION['token']) {
    exit("不正な送信です。");
}
unset($_SESSION['token']); // トークンは使い捨て

// ======================================================
// 入力値の取得とサニタイズ
// ======================================================
$companyName = trim($_POST['companyName'] ?? '');
$userName    = trim($_POST['userName'] ?? '');
$email       = trim($_POST['email'] ?? '');
$subject     = trim($_POST['subject'] ?? '');
$textDetail  = trim($_POST['textDetail'] ?? '');

// XSS対策
function h($str) {
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

// ======================================================
// バリデーション
// ======================================================
$errors = [];

if ($companyName === '') {
    $errors[] = "企業名 / 団体名は必須です。";
}
if ($userName === '') {
    $errors[] = "お名前は必須です。";
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "正しいメールアドレスを入力してください。";
}
if ($textDetail === '') {
    $errors[] = "お問い合わせ内容は必須です。";
}

// 改行コード除去（メールヘッダーインジェクション対策）
if (preg_match('/[\r\n]/', $email) || preg_match('/[\r\n]/', $userName)) {
    $errors[] = "不正な入力が検出されました。";
}

if (!empty($errors)) {
    echo "<h2>入力エラーが発生しました</h2><ul>";
    foreach ($errors as $e) {
        echo "<li>" . h($e) . "</li>";
    }
    echo "</ul><a href='javascript:history.back()'>戻る</a>";
    exit;
}

// ======================================================
// 管理者宛メール送信
// ======================================================
$adminSubject = "【お問い合わせ】" . ($subject ?: '件名なし');
$adminBody = <<<EOT
ポートフォリオサイトにお問い合わせがありました。

───────────────────────
■ 企業名 / 団体名
{$companyName}

■ お名前
{$userName}

■ メールアドレス
{$email}

■ 件名
{$subject}

■ 内容
{$textDetail}
───────────────────────

送信日時：{date("Y-m-d H:i:s")}
送信元IP：{$_SERVER['REMOTE_ADDR']}
EOT;

$adminHeaders = "From: {$email}\r\n";
$adminHeaders .= "Reply-To: {$email}\r\n";

$adminSend = mb_send_mail($adminEmail, $adminSubject, $adminBody, $adminHeaders);

// ======================================================
// 自動返信メール（ユーザー宛）
// ======================================================
$userSubject = "【{$siteName}】お問い合わせありがとうございます";
$userBody = <<<EOT
{$userName} 様

この度は「{$siteName}」へお問い合わせいただき、誠にありがとうございます。
以下の内容で受け付けました。

───────────────────────
■ 企業名 / 団体名
{$companyName}

■ お名前
{$userName}

■ メールアドレス
{$email}

■ 件名
{$subject}

■ 内容
{$textDetail}
───────────────────────

※本メールは自動送信です。
本人より折り返しご連絡いたしますので、しばらくお待ちください。

───────────────────────
{$siteName}
Email: {$adminEmail}
───────────────────────
EOT;

$userHeaders = "From: no-reply@{$fromDomain}\r\n";
$userHeaders .= "Reply-To: {$adminEmail}\r\n";

$userSend = mb_send_mail($email, $userSubject, $userBody, $userHeaders);

// ======================================================
// 結果表示
// ======================================================
if ($adminSend && $userSend) {
    $_SESSION['message'] = ['<h2>送信が完了しました。</h2>', '<p>お問い合わせありがとうございました。<br>自動返信メールをお送りしましたのでご確認ください。</p>'];
} else {
    $_SESSION['message'] = ['<h2>送信に失敗しました。</h2>', '<p>大変お手数ですが、再度お試しいただくか、直接メールにてご連絡ください。</p>'];
}
header('Location: ../result.php');
exit;
?>
