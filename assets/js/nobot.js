setTimeout(function () {
  $.ajax({
    type: "post",
    url: "index.php",
    data: "user=no-bot",
    success: function (contenu) {
      console.log("contenu");
    },
    error: function (responce) {},
  });
}, 3000);
