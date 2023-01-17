//eliminando productos desde el front
const deleteBtns = document.querySelectorAll("#cart__product--deleteBtn");

const deleteProduct = async (cid, pid) => {
  try {
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.status === "succes") {
      alert("Producto eliminado correctamente");
    }

    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

deleteBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const pid = btn.value;

    deleteProduct("63c5494987fcf899bff4f698", pid);
    //location.reload();
  });
});
