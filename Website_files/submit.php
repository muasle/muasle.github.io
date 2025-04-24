<?php
//error_reporting(E_ALL);
//ini_set('display_errors', 1);

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Database connection parameters
    $dbHost = '34.170.255.121';
    $dbUser = 'web_user';
    $dbPass = 'OHg0dh3lp!';
    $dbName = 'natural_disaster_db';
    $dbPort = 3306;
      // Create a new connection
      $conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName, $dbPort);

      // Check the connection
      if ($conn->connect_error) {
          die('Error connecting to MySQL server: ' . $conn->connect_error);
      }

    // Prepare and bind the INSERT query using prepared statements
    $query = "INSERT INTO user_responses (name, 
                                        adults, 
                                        children, 
                                        infants, 
                                        hurricanes_tropical_storms,
                                        tornadoes, 
                                        earthquakes,
                                        wildfires,
                                        floods,
                                        landslides,
                                        tsunamis,
                                        volcanic_eruptions,
                                        droughts,
                                        heatwaves,
                                        blizzards,
                                        avalanches,
                                        thunderstorms,
                                        hailstorms,
                                        high_winds,
                                        microbursts,
                                        dust_storms,
                                        fog_visibility,
                                        industrial_accidents,
                                        chemical_spills,
                                        nuclear_accidents,
                                        power_outages,
                                        water_supply_disruptions,
                                        gas_leaks_explosions,
                                        sewage_system_failures) 
                                        VALUES (?, ?, ?, ?, ?,
                                                 ?, ?,?, ?, ?, 
                                                 ?, ?, ?, ?, ?, 
                                                 ?, ?, ?, ?, ?, 
                                                 ?, ?, ?, ?, ?, 
                                                 ?, ?, ?, ?)";

    $stmt = $conn->prepare($query);

    // Bind parameters to the prepared statement
    $stmt->bind_param("siiisssssssssssssssssssssssss",
                    $_POST['name'], 
                    $_POST['adults'], 
                    $_POST['children'],
                    $_POST['infants'],
                    $_POST['hurricanes_tropical_storms'],
                    $_POST['tornadoes'],
                    $_POST['earthquakes'],
                    $_POST['wildfires'],
                    $_POST['floods'],
                    $_POST['landslides'],
                    $_POST['tsunamis'],
                    $_POST['volcanic_eruptions'],
                    $_POST['droughts'],
                    $_POST['heatwaves'],
                    $_POST['blizzards'],
                    $_POST['avalanches'],
                    $_POST['thunderstorms'],
                    $_POST['hailstorms'],
                    $_POST['high_winds'],
                    $_POST['microbursts'],
                    $_POST['dust_storms'],
                    $_POST['fog_visibility'],
                    $_POST['industrial_accidents'],
                    $_POST['chemical_spills'],
                    $_POST['nuclear_accidents'],
                    $_POST['power_outages'],
                    $_POST['water_supply_disruptions'],
                    $_POST['gas_leaks_explosions'],
                    $_POST['sewage_system_failures']);

    // Execute the prepared statement
    if ($stmt->execute()) {
        // Query to get user's responses
        // Retrieve the inserted user ID
        $userId = $stmt->insert_id; 
        $stmt = $conn->prepare("SELECT * FROM user_responses WHERE id=?");
        // from INSERT id
        $stmt->bind_param('i', $userId);
        $stmt->execute(); 
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        // Array to store gear
        $gear = []; 

        // Calculate additional gear based on user responses
        $water = ($user['adults'] + $user['children'] + $user['infants']) * 3; 
        $adultFood = ($user['adults'] + $user['children']) * 3000;
        $infantFood = $user['infants'] * 1500;
        $adultKits = $user['adults'];
        $childKits = $user['children'];
        $infantKits = $user['infants'];

        // Append to gear list string
        $gearList .= ", $water gallons of water, $adultFood calories of adult food, $infantFood calories of infant food, $adultKits adult first aid kits, $childKits child first aid kits, $infantKits infant first aid kits";

        // Retrieve gear items from universal_gear category
        $stmt = $conn->query("SELECT gear_item FROM universal_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item'));

        // Check responses and get corresponding gear
        if ($user['hurricanes_tropical_storms'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM hurricanes_tropical_storms_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['tornadoes'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM tornadoes_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['earthquakes'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM earthquakes_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['wildfires'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM wildfires_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['floods'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM floods_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['landslides'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM landslides_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['tsunamis'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM tsunamis_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['volcanic_eruptions'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM volcanic_eruptions_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['droughts'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM droughts_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['heatwaves'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM heatwaves_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['blizzards'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM blizzards_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['avalanches'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM avalanches_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['thunderstorms'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM thunderstorms_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['hailstorms'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM hailstorms_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['high_winds'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM high_winds_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['microbursts'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM microbursts_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['dust_storms'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM dust_storms_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['fog_visibility'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM fog_visibility_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['industrial_accidents'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM industrial_accidents_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['chemical_spills'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM chemical_spills_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['nuclear_accidents'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM nuclear_accidents_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['power_outages'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM power_outages_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['water_supply_disruptions'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM water_supply_disruptions_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['gas_leaks_explosions'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM gas_leaks_explosions_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        if ($user['sewage_system_failures'] == 'yes') {
        $stmt = $conn->query("SELECT gear_item FROM sewage_system_failures_gear");
        $gear = array_merge($gear, array_column($stmt->fetch_all(MYSQLI_ASSOC), 'gear_item')); 
        }

        // Remove duplicates
        $gear = array_unique($gear); 

        // Join items into comma separated string
        $gearList = implode(', ', $gear);

        // Calculate additional gear based on user responses
        $water = ($user['adults'] + $user['children'] + $user['infants']) * 3; 
        $adultFood = ($user['adults'] + $user['children']) * 3000;
        $infantFood = $user['infants'] * 1500;
        $adultKits = $user['adults'];
        $childKits = $user['children'];
        $infantKits = $user['infants'];

        // Append to gear list string
        $gearList .= ", $water gallons of water, $adultFood calories of adult food, $infantFood calories of infant food, $adultKits adult first aid kits, $childKits child first aid kits, $infantKits infant first aid kits";


        //creating passing varible user_name
        $user_name = $user['name'];
    }
}
?>

<html>
<!-- Display the gear list and user name -->
<hr>
<!--
<p>Result of query:</p>
<p>User: <?php echo $user_name; ?></p>
<p>Gear List: <?php echo $gearList; ?></p>
-->
<?php
$file = 'Generative_PDF_page/test.txt';
file_put_contents($file, $gearList);
header('Location:/Generative_PDF_page/index.php')
?>
</html>