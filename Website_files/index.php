<!DOCTYPE html>
<html lang="en">

<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FEMAp</title>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"> </script>
  <link rel="stylesheet" href="style.css">
</head>

<!--- <style> <?php include 'style.css'; ?> </style> /> -->

<body>

  <header>
    <nav>
      <ul>
        <a href="About_page/index.php">About</a>
        <a <span style="padding-left: 55px;" href="https://www.fema.gov/about/contact">Contact </span></a>
        <a <span style="padding-left: 75px;" href="https://www.mayoclinic.org/first-aid/first-aid-kits/basics/art-20056673">First Aid Kit Supplies</span></a>
      </ul>
    </nav>
  </header>

  <main>

    <section class="hero">
      <div class="content">
        <h1><center>FEMAp</center></h1>
        <p><pre>     Complete the questionnaire below to receive general advice on how to handle hazards near you.</pre></center></p>
       <!--  <a href="Generative_PDF_page/index.php" class="btn">
          <span style="padding-left: 55px;">Click Here To Get Started</span>
        </a> -->
      </div>
    </section>

    <section class="posts">

      <h2>Location:</h2>
      <h3>Use this interactive map to track where you are on the maps that follow.</h3>
      <iframe src="https://www.google.com/maps/d/u/0/embed?mid=1O5t-WPX3L9ZyOeUen-pZ2H_1mj8BCls&ehbc=2E312F" width="640" height="480"></iframe>
<!--
      <h2>Checklist</h2>
      <iframe src="https://docs.google.com/forms/d/e/1FAIpQLScF8CjdG3sYW855tML0LCCHN4xcJVN1Qj02Z4UVEpBZAUp92Q/viewform?embedded=true" width="640" height="993" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
-->
      <!--<article class="post">
        <a href="https://hazards.fema.gov/nri/expected-annual-loss">
          <img src="images/map-expectedannualloss.png" width = "800" height = "550" alt="US Expected Loss Map">
        </a>
        <h3>
          <a href="#">Post Title 1</a>
        </h3>
        <p>Post excerpt...</p>
        <a href="#" class="readmore">Read more</a>
      </article> -->


    </section>

    <section class="SecondTitle">
      <h2> <span style="padding-left: 0px;">Hazard Checklist:</span></h2>
      <h2> <span style="padding-left: 75px;">Use the maps and questions below to cater your preventative needs.</span></h2>
      <h2> <span style="padding-left: 75px;">Click the checkbox on the left of the questions to indicate "yes".</span></h2>
      <h2> <span style="padding-left: 75px;">For more information on the natural risk, click the map or select contact at the top of the page. </span></h2>
      <h2> <span style="padding-left: 75px;">After completing the checklist click submit to generate your personalized natural hazard </span></h2>
      <h2> <span style="padding-left: 75px;">hazard prevention list. </span></h2>


  <section class="checklist">

  <!-- Make a questions with a text box that takes in how many family members (adults, children, infants) there are (check github for queries) -->
  <!-- Add the city based questions as well -->

  <form method="post" action="submit.php">

  <article>

  <label for="name">What is your first name (or nickname)?</label>

    <input type="text" id="name" name="name">

  </article>

  <script>

    const $name = $('#name');

    $name.change(function() {
    $name.val(this.value); 
    });

  </script>


  <article>

    <label for="adults">How many adults are in your household (18+ years)?</label>
    
    <input type="number" id="adults" name="adults">

  </article>

  <article>

    <label for="infants">How many infants are in your household (0-1 years)?</label>
  
    <input type="number" id="infants" name="infants">
  
  </article>
  
  <article>
  
    <label for="children">How many children are in your household (1-12 years)?</label>  
  
    <input type="number" id="children" name="children">
  
  </article>
  
    
    <script>
      // Get entered value
      const numAdults = document.getElementById("adults").value;
      const numInfants = document.getElementById("infants").value;
      const numChildren = document.getElementById("children").value;

      
      // Save value to adult input
      const adultInput = document.createElement("input");
      adultInput.type = "hidden";
      adultInput.name = "numAdults"; 
      adultInput.value = numAdults;

      // Infants hidden input
      const infantInput = document.createElement("input");
      infantInput.type = "hidden";
      infantInput.name = "numInfants";
      infantInput.value = numInfants;

      // Children hidden input
      const childInput = document.createElement("input");
      childInput.type = "hidden";
      childInput.name = "numChildren";
      childInput.value = numChildren;

      // Append to document
      document.body.appendChild(infantInput);
      document.body.appendChild(childInput);
      document.body.appendChild(adultInput);
    </script>
  
  <br> <br>
  <article>
    <a href="https://hazards.fema.gov/nri/drought">
      <img src="images/map-drought_risk.png" width = "600" height = "350">
    </a>
    <p>
      <input type="hidden" name="droughts" value="no">  
      <input type="checkbox" id="droughts" name="droughts" value="yes">
      <label for="droughts">Do you live in a relatively dry area with little rainfall for months at a time?</label>
    </p>
    
  </article>

  <br> <br>
  <article>
    <a href="https://hazards.fema.gov/nri/heat-wave">
      <img src="images/map-heatwave_risk.png" width = "600" height = "350" >
    </a>
    <p>
      <input type="hidden" name="heatwaves" value="no">  
      <input type="checkbox" id="heatwaves" name="heatwaves" value="yes">
      <label for="heatwaves">Do you live in a dry/arid region, or at a relatively high-pressure altitude?</label>
    </p>
  </article>

  <br> <br>
  <article>
    <a href="https://hazards.fema.gov/nri/wildfire">
      <img src="images/map-wildfire_risk.png" width = "600" height = "350" >
    </a>
    <p>
      <input type="hidden" name="wildfires" value="no">  
      <input type="checkbox" id="wildfires" name="wildfires" value="yes">
      <label for="wildfires">Do you live near any forests, grasslands, or shrublands?</label>
    </p>
  </article>

  <br> <br>
  <article>
    <a href="https://hazards.fema.gov/nri/earthquake">
      <img src="images/map-earthquake_risk.png" width = "600" height = "350" >
    </a>
    <p>
      <input type="hidden" name="earthquakes" value="no">  
      <input type="checkbox" id="earthquakes" name="earthquakes" value="yes">
      <label for="earthquakes">Do you live near any fault lines?</label>
    </p>
  </article>

  <br> <br>
  <article>
    <a href="https://hazards.fema.gov/nri/landslide">
      <img src="images/map-landslide_risk.png" width = "600" height = "350" >
    </a>
    <p>
      <input type="hidden" name="landslides" value="no">  
      <input type="checkbox" id="landslides" name="landslides" value="yes">
      <label for="landslides">Do you live on or beside any mountains or cliffsides?
      </label>
    </p>
  </article>

  <br> <br>
  <article>
    <a href="https://hazards.fema.gov/nri/strong-wind">
      <img src="images/map-strongwind_risk.png" width = "600" height = "350" >
    </a>
    <p>
      <input type="hidden" name="high_winds" value="no">  
      <input type="checkbox" id="high_winds" name="high_winds" value="yes">
      <label for="high_winds">Does your region experience high winds?</label>
    </p>
  </article>

  <br> <br>
  <article>
    <a href="https://hazards.fema.gov/nri/lightning">
      <img src="images/map-lightning_risk.png" width = "600" height = "350" >
    </a>
    <p>
      <input type="hidden" id="thunderstorms" name="thunderstorms" value="no" onchange="copyThunder()";>  
      <input type="checkbox" id="thunderstorms" name="thunderstorms" value="yes" onchange="copyThunder()";>
      <label for="thunderstorms">Does your region experience thunderstorms?</label>
    </p>
  </article>

  <br> <br>
  <article>
    <a href="https://hazards.fema.gov/nri/tornado">
      <img src="images/map-tornado_risk.png" width = "600" height = "350" >
    </a>
    <p>
      <input type="hidden" name="tornadoes" value="no">  
      <input type="checkbox" id="tornadoes" name="tornadoes" value="yes">
      <label for="tornadoes">Do you live in or around flatlands/plains?</label>
    </p>
  </article>

  <br> <br>
  <article>
    <a href="https://hazards.fema.gov/nri/hurricane">
      <img src="images/map-hurricane_risk.png" width = "600" height = "350"> 
    </a>
    <p>
      <input type="hidden" name="hurricanes_tropical_storms" value="no">  
      <input type="checkbox" id="hurricanes_tropical_storms" name="hurricanes_tropical_storms" value="yes">
      <label for="hurricanes_tropical_storms">Do you live along the East or SE coasts, or on an island?</label>
    </p>
  </article>

  <br> <br>
  <article>
    <a href="https://hazards.fema.gov/nri/coastal-flooding">
      <img src="images/map-coastalflooding_risk.png" width = "600" height = "350" >
    </a>
    <p>
      <input type="hidden" name="floods" value="no">  
      <input type="checkbox" id="floods" name="floods" value="yes">
      <label for="floods">Do you live along the coast and/or near a river?</label>
    </p> 
  </article>

  <br> <br>
  <article>
    <a href="https://hazards.fema.gov/nri/tsunami">
      <img src="images/map-tsunami_risk.png" width = "600" height = "350" >
    </a>
    <p>
      <input type="hidden" name="tsunamis" value="no">  
      <input type="checkbox" id="tsunamis" name="tsunamis" value="yes">
      <label for="tsunamis">Do you live along the West coast?</label>
    </p>
  </article>

  <br> <br>
  <article>
    <a href="https://hazards.fema.gov/nri/volcanic-activity">
      <img src="images/map-volcanicactivity_risk.png" width = "600" height = "350"> 
    </a>
    <p>
      <input type="hidden" name="volcanic_eruptions" value="no">  
      <input type="checkbox" id="volcanic_eruptions" name="volcanic_eruptions" value="yes">
      <label for="volcanic_eruptions">Do you live near any active/inactive volcanoes, or are you on an island?</label>
    </p>
  </article>

  <br> <br>
  <article>
    <a href="https://hazards.fema.gov/nri/hail">
      <img src="images/map-hail_risk.png" width = "600" height = "350" >
    </a>
    <p>
      <input type="hidden" name="hailstorms" value="no">  
      <input type="checkbox" id="hailstorms" name="hailstorms" value="yes">
      <label for="hailstorms">Do you live in a flat area region with moderate or high elevation (ex. Great Plains)?</label>
    </p>

  </article>

  <br> <br>
  <article>
    <a href="https://hazards.fema.gov/nri/ice-storm">
      <img src="images/map-icestorm_risk.png" width = "600" height = "350">
    </a>
    <p>
      <input type="hidden" name="ice_storms" value="no">  
      <input type="checkbox" id="ice_storms" name="ice_storms" value="yes">
      <label for="ice_storms">Do live in an area that experiences regular/annual snowfall (greater than 12 inches)?</label>
    </p>

  </article>

  <br> <br>
  <article>
    <a href="https://hazards.fema.gov/nri/winter-weather">
      <img src="images/map-winterweather_risk.png" width = "600" height = "350" >
    </a>
    <p>
      <input type="hidden" name="blizzards" value="no">  
      <input type="checkbox" id="blizzards" name="blizzards" value="yes">
      <label for="blizzards">Do you live inland (non-coastal) and experience regular/annual snowfall? (greater than 12 inches)?</label>
    </p>
  </article>

  <br> <br>
  <article>
    <a href="https://hazards.fema.gov/nri/avalanche">
      <img src="images/map-avalanche_risk.png" width = "600" height = "350" >
    </a>
    <p>
      <input type="hidden" name="avalanches" value="no">  
      <input type="checkbox" id="avalanches" name="avalanches" value="yes">
      <label for="avalanches">Do you live on/around a mountainous region that experiences regular/annual snowfall? (greater than 12 inches)</label>
    </p>
  </article>


  <br>
  <article>
    <p>
      <input type="hidden" name="fog_visibility" value="no">  
      <input type="checkbox" id="fog_visibility" name="fog_visibility" value="yes">
      <label for="fog_visibility">Do you live near any natural waterways, such as river valleys or creeks?</label>
    </p>
  </article>

  <article>
    <p>
      <input type="hidden" name="dust_storms" value="no">  
      <input type="checkbox" id="dust_storms" name="dust_storms" value="yes">
      <label for="dust_storms">Do you live near a desert that experiences high winds (ex. Southwestern US)?</label>
    </p>
  </article>


  <!-- CITY BASED QUESTIONS -->
  <article>
    <p>
      <input type="hidden" name="power_outages" value="no">
      <input type="checkbox" id="power_outages" name="power_outages" value="yes">
      <label for="power_outages">Do you own and maintain your own source of electrical power?</label>
    </p>
    </article>
  
    <article>
      <p>
      <input type="hidden" name="water_supply_disruptions" value="no">
      <input type="checkbox" id="water_supply_disruptions" name="water_supply_disruptions" value="yes">
      <label for="water_supply_disruptions">Do you own and maintain your own source of water?</label>
    </p>
    </article>
  
    <article>
      <p>
      <input type="hidden" name="gas_leaks_explosions" value="no">
      <input type="checkbox" id="gas_leaks_explosions" name="gas_leaks_explosions" value="yes">
      <label for="gas_leaks_explosions">Do you own any gas appliances, to include heating?</label>
    </p>
    </article>
  
    <article>
      <p>
      <input type="hidden" id="chemical_spills" name="chemical_spills" value="no" onchange="copyChemical();">
      <input type="checkbox" id="chemical_spills" name="chemical_spills" value="yes" onchange="copyChemical();">
      <label for="chemical_spills">Do you live in or near any cities, factories, or industrial plants?</label>
    </p>
    </article>

    <article>
      <p>
      <input type="hidden" name="nuclear_accidents" value="no">
      <input type="checkbox" id="nuclear_accidents" name="nuclear_accidents" value="yes">
      <label for="nuclear_accidents">Do you live near any nuclear facilities, major cities, or military installations?</label>
    </p>
    </article>

    <article>
      <p>
      <input type="hidden" name="sewage_system_failures" value="no">
      <input type="checkbox" id="sewage_system_failures" name="sewage_system_failures" value="yes">
      <label for="sewage_system_failures">Do you use a city/town sewage system, (if unsure, select yes)?</label>
    </p>
    </article>

    <br> <br>

    <article>
      <input type="hidden" id="microbursts" name="microbursts" value="no">
    </article>

    <article>
      <input type="hidden" id="industrial_accidents" name="industrial_accidents" value="no">
    </article>


    <button class="Submit" type="Submit">Submit</button>

    <script>


    function copyChemical() {
    var text1 = document.getElementById("chemical_spills").value;
    document.getElementById("industrial_accidents").value = text1;
    }

    function copyThunder() {
    var text2 = document.getElementById("thunderstorms").value;
    document.getElementById("microbursts").value = text2;
    }
    
        
    </script>

    </form>
  </section>


  </main>

  <footer>
    <p><span style="padding-left: 75px;">2023 FEMAp, we are not affiliated with FEMA.</span></p>
  </footer>

</body>

</html>