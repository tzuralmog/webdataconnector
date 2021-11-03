(function () {
  "use strict";


  // var test = $.ajax({
  //   url: `https://apps.cloud.us.kontakt.io/v2/locations/floors?page=0&size=50&sort=name`,
  //   dataType: "json",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Api-Key": "ilcGMcUsxAQEUWGHZPHiCTCqVafdMfFx",
  //   },
  //   success: function (data) {
  //     console.log("Succsess");
  //     console.log(data);
  //     const array = data.content;
  //     console.log(array);
  //     // for (let index = 0; index < array.length; index++) {
  //     //   var venue = {
  //     //     Id: array[index].id,
  //     //     Address: array[index].address,
  //     //     Name: array[index].name,
  //     //     Location: array[index].latLngGeojson,
  //     //   };
  //     //   console.log(venue);
  //     // }
  //   },
  //   error: function (xhr, ajaxOptions, thrownError) {
  //   },
  // });
  var config = {
    clientId: "OWMVRPSNUVEUDVLXJUUJEO0AWKVF3ELQPVWVSAMV5IDWZXC3",
    redirectUri: "http://localhost:3333/redirect",
    authUrl: "https://foursquare.com/",
    version: "20190102",
  };

  $(document).ready(function () {
    // uncomment for test
    // test;
    $("#getbuildingsbutton").click(function () {
      
      tableau.connectionName = "Kontakt.io Data";
      tableau.submit();
    });
  });

  function getVenueLikesURI(accessToken) {
    return (
      "https://api.foursquare.com/v2/users/self/venuelikes?oauth_token=" +
      accessToken +
      "&v=" +
      config.version
    );
  }

  //------------- Tableau WDC code -------------//
  // Create tableau connector, should be called first
  var myConnector = tableau.makeConnector();

  // add this after tableau.makeConnector() function.

  // The myConnector.getSchema() goes here

  // Declare the data to Tableau that we are returning from Foursquare
  myConnector.getSchema = function (schemaCallback) {
    var schema = [];


    var cols = [
      {
        id: "Id",
        dataType: tableau.dataTypeEnum.float,
      },
      {
        id: "Address",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "Name",
        dataType: tableau.dataTypeEnum.string,
      },
      // {
      //   id: "Location",
      //   dataType: tableau.dataTypeEnum.geometry,
      // },
    ];

    var tableInfo = {
      id: "Buildings",
      columns: cols,
    };

    schema.push(tableInfo);

    cols = [
      {
        id: "Id",
        dataType: tableau.dataTypeEnum.float,
      },
      {
        id: "BuildingId",
        dataType: tableau.dataTypeEnum.float,
      },
      {
        id: "Name",
        dataType: tableau.dataTypeEnum.string,
      },
      {
        id: "Level",
        dataType: tableau.dataTypeEnum.float,
      },
    ];

    tableInfo = {
      id: "Floors",
      columns: cols,
    };

    schema.push(tableInfo);

    schemaCallback(schema);
  };

  // This function actually make the foursquare API call and
  // parses the results and passes them back to Tableau
  myConnector.getData = async function (table, doneCallback) {
    // begining
    var dataToReturn = [];
    console.log(table.tableInfo.id);

    // var hasMoreData = false;

    // var accessToken = tableau.password;\
    // branch to table
    if (table.tableInfo.id == "Buildings") {
      var xhr = $.ajax({
        url: `https://apps.cloud.us.kontakt.io/v2/locations/buildings?page=0&size=50&sort=name`,
        dataType: "json",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": "ilcGMcUsxAQEUWGHZPHiCTCqVafdMfFx",
        },
        success: function (data) {
          
          const array = data.content;
          for (let index = 0; index < array.length; index++) {
            var venue = {
              Id: array[index].id,
              Address: array[index].address,
              Name: array[index].name,
              // Location: array[index].latLngGeojson,
            };
            dataToReturn.push(venue);
          }
          table.appendRows(dataToReturn);
          console.log(table);
          doneCallback();
        },
        error: function (xhr, ajaxOptions, thrownError) {
          // WDC should do more granular error checking here
          // or on the server side.  This is just a sample of new API.
          tableau.abortForAuth("Invalid Access Token");
        },
      });
    }else if(table.tableInfo.id == "Floors"){
      var xhr = $.ajax({
        url: `https://apps.cloud.us.kontakt.io/v2/locations/floors?page=0&size=50&sort=name`,
        dataType: "json",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": "ilcGMcUsxAQEUWGHZPHiCTCqVafdMfFx",
        },
        success: function (data) {
          
          const array = data.content;
          for (let index = 0; index < array.length; index++) {
            var venue = {
              Id: array[index].id,
              BuildingId: array[index].building.id,
              Name: array[index].name,
              Level: array[index].level,
            };
            dataToReturn.push(venue);
          }
          table.appendRows(dataToReturn);
          console.log(table);
          doneCallback();
        },
        error: function (xhr, ajaxOptions, thrownError) {
          // WDC should do more granular error checking here
          // or on the server side.  This is just a sample of new API.
          tableau.abortForAuth("Invalid Access Token");
        },
      });
    }
    

    
  };

  // Register the tableau connector, call this last
  tableau.registerConnector(myConnector);
})(); // end of anonymous function
