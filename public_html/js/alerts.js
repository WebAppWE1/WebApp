"use strict";

const deleteAlert = (text, method) => {
    swal({
        title: "Bist du dir sicher?",
        text: `Wollen Sie den ${text} wirklich löschen?`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          swal(`Der ${text} wurde gelöscht!`, {
            icon: "success",
          });
          method;
        } else {
          swal("Aktion wurde abgebrochen!");
        }
      });
};