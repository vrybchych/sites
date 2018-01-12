<?php
$mysqli = new mysqli("localhost", "root", "qwerty", "sites");
if ($mysqli->connect_errno) {
    echo "Can't connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$res = $mysqli->query("SELECT * FROM pages");

function insert_link_into_db($mysqli, $domain, $link, $page_id) {
  $sql = "INSERT INTO links (domain, link, page_id)
    VALUES ('".$domain."', '".$link."', '".$page_id."')";
  if ($mysqli->query($sql) === TRUE) {
    echo "New record created successfully\n";
  } else {
      echo "Error: " . $sql . "\n" . $mysqli->error."\n";
  }
}

while ($row = $res->fetch_assoc()) {
  $html = base64_decode($row['html']);
  if (strpos($html, "nofollow") !== false) {
    echo "NOFOLLOW\n";
    continue ;
  }
  preg_match_all("<a href=\"(http|https)://([^\s]*)\">", $html, $matches);
  foreach ($matches[0] as &$link) {
    $link = str_replace("a href=", "", $link); // remove a href=
    $link = str_replace("\"", "", $link); // remove "
    $domain = parse_url($link)['host'];
    insert_link_into_db($mysqli, $domain, $link, $row['id']);
  }
}
$mysqli->close();
