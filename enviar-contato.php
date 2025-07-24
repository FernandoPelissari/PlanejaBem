<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nome = htmlspecialchars($_POST["nome"]);
    $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
    $assunto = htmlspecialchars($_POST["assunto"]);
    $mensagem = htmlspecialchars($_POST["mensagem"]);

    $destinatario = "cfasdev@gmail.com";
    $headers = "From: $email\r\nReply-To: $email\r\n";
    $corpo = "Nome: $nome\nE-mail: $email\nAssunto: $assunto\n\nMensagem:\n$mensagem";

    // Se houver anexo
    if (!empty($_FILES["anexo"]["tmp_name"])) {
        $file = $_FILES["anexo"];
        $content = chunk_split(base64_encode(file_get_contents($file["tmp_name"])));
        $uid = md5(uniqid(time()));
        $filename = $file["name"];
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"$uid\"\r\n\r\n";
        $headers .= "--$uid\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $headers .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $headers .= "$corpo\r\n\r\n";
        $headers .= "--$uid\r\n";
        $headers .= "Content-Type: " . $file["type"] . "; name=\"$filename\"\r\n";
        $headers .= "Content-Transfer-Encoding: base64\r\n";
        $headers .= "Content-Disposition: attachment; filename=\"$filename\"\r\n\r\n";
        $headers .= "$content\r\n\r\n";
        $headers .= "--$uid--";
        mail($destinatario, $assunto, "", $headers);
    } else {
        mail($destinatario, $assunto, $corpo, $headers);
    }

    echo "<script>alert('Mensagem enviada com sucesso!'); window.location.href='contato.html';</script>";
}
?>
