<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE-edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Checklist</title>
        <link rel="stylesheet" type="text/css" href="style.css">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />

        <style>
            .btn-print {
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
            border-radius: 50%;
            outline: none;
            border: none;
            cursor: pointer;
            padding-left: 10px;
            color: rgb(2, 76, 2);
        }

        </style>
    </head>

    <body>
        <main>
        <div class="wrapper">
            <div class="checklist_wrapper"> <!--invoice_wrapper-->
                <div class="header">
                    <div class="logo_wrap"> <!--logo_invoice_wrap-->
                        <div class="logo_sec">
                            <img src="FEMAp.png"
                            width="130"
                            height="80">     
                        </div>    
                    </div>
                    <div class="title_wrap"> <!--bill_total_wrap-->
                        <div class="name_sec"> <!--bill_sec-->
                            <p class="bold name">FEMA Checklist</p>
                            <div class="for">For:</div>
                            <span id="username"></span></p><script>var user = "Username";
                                document.getElementById("username").innerHTML=user.toLocaleString();</script>
                        </div>
                        <div class="date"> <!--total_wrap-->
                            <div class="bold date">Date</div>
                            <!--<span><input type="date"></span>-->
                            <span id="datetime"></span></p><script>var dt = new Date();
                                document.getElementById("datetime").innerHTML=dt.toLocaleString();</script>
                        </div>
                    </div>
                </div>
                <div class="body">
                    <div class="main_table">
                        <div class="table_header">
                            <div class="row">
                            <div class="col col_no">NO.</div>
                            <div class="col col_des">ITEM DESCRIPTION</div>
                            <div class="col col_check">CHECK</div>
                        </div>
                    </div>
                    <div class="table_body">
                        <!-- PHP code to parse gear list and create rows -->
                        <?php
                        $gearList = file_get_contents("test.txt"); // Placeholder for gear list, it will be assigned from submit.php
                        if (isset($_POST['gear_list'])) {
                            $gearList = $_POST['gear_list'];
                        }
                        $gearItems = explode(', ', $gearList);
                        foreach ($gearItems as $index => $gearItem) {
                            echo '<div class="row">';
                            echo '<div class="col col_no">' . ($index + 1) . '</div>';
                            echo '<div class="col col_des">' . $gearItem . '</div>';
                            echo '<div class="col col_check"><input type="checkbox"></div>';
                            echo '</div>';
                        }
                        ?>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="button_wrap">
                        <button class="btn-print" type="button">
                            <p class="bold">Click Here to Print!</p>
                        </button>
                        
                        <script>
                            const btnPrint = document.querySelector(".btn-print")
                                
                            btnPrint.addEventListener("click", () => window.print())
                        </script>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </main>
    </body>
</html>