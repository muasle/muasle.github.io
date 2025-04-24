<?php
$conn = mysqli_connect('34.170.255.121', 'web_user', 'OHg0dh3lp!', 'natural_disaster_db', '3306') or die('Error connecting to MySQL server.');
?>

<html>
<head>
<title>Attempting MySQL Connection</title>
</head>

<?php
$state = $_POST['state'];

$state = mysqli_real_escape_string($conn, $state);

$query = "SELECT * ";
$query = $query."FROM universal_gear";
?>

<hr>
<p>
Result of query:
<p>

<?php
$result = mysqli_query($conn, $query)
or die(mysqli_error($conn));

while($row = mysqli_fetch_array($result)) {
  echo $row['gear_item'];
}
mysqli_free_result($result);
mysqli_close($conn);
?>

<p>
</body>
</html>