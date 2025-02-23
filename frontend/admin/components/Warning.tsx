import Swal from 'sweetalert2';

export const showDeleteWarning = (itemName: string, onConfirm: () => void): void => {
    Swal.fire({
      title: `Are you sure?`,
      text: `Do you really want to delete "${itemName}"? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm(); // Execute the delete function
        Swal.fire("Deleted!", `"${itemName}" has been deleted.`, "success");
      }
    });
  };