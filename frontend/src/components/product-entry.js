import React, { useState } from "react";

function ProductEntry({ product, removeProduct, setErrorAndWait }) {
  // Define state used for stacking and applying edits
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);
  const [currentProduct, setCurrentProduct] = useState(product);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit button clicked
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Cancel button clicked
  const handleCancel = () => {
    // Reset editing state
    setIsEditing(false);
    setEditedProduct(currentProduct);
  };

  // Add dev button clicked
  const handleAddDeveloper = () => {
    // Add an empty string to the list of developers
    setEditedProduct({
      ...editedProduct,
      developers: [...editedProduct.developers, ""],
    });
  };

  // Remove dev button clicked
  const handleRemoveDeveloper = (indexToRemove) => {
    // Remove dev at index using filter.
    setEditedProduct({
      ...editedProduct,
      developers: editedProduct.developers.filter(
        (_, index) => index !== indexToRemove
      ),
    });
  };

  // One of the inputs (not developers, though) were changed
  const handleChange = (event) => {
    // Update corresponding field in edited product with input value
    // check target value !== "" because of weird date picker bug where certain invalid dates will fire an onchange with blank data.
    if (event.target.value !== "") {
      setEditedProduct({
        ...editedProduct,
        [event.target.name]: event.target.value,
      });
    }
  };

  // Save button clicked
  const handleSave = () => {
    // Send POST to BCWS API with updated information
    fetch(`http://localhost:3000/api/products/${product.productId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedProduct),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Server not available");
        }
        return res.json();
      })
      .then((data) => setCurrentProduct(data))
      .catch((error) => {
        // If this fails, display an error and reload data once api healthy again.
        setErrorAndWait(
          "Save product failed:\nAPI Likely down. The page will reload when the API is deemed operational."
        );
      });

    // Reset editing state
    setIsEditing(false);
  };

  const handleDelete = (event) => {
    if (isDeleting) {
      // Send POST to BCWS API with updated information
      fetch(`http://localhost:3000/api/products/${product.productId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Server not available");
          }
          removeProduct(product.productId);
        })
        .catch((error) => {
          setErrorAndWait(
            // If this fails, display an error and reload data once api healthy again.
            "Delete product failed:\nAPI Likely down. The page will reload when the API is deemed operational."
          );
        });
    } else {
      setIsDeleting(true);
    }
  };

  return (
    <tr key={currentProduct.productId}>
      <td className="border px-2 py-1 align-top">{currentProduct.productId}</td>
      <td className="border px-2 py-1 align-top">
        {isEditing ? (
          <input
            className="border px-1"
            type="text"
            name="productName"
            value={editedProduct.productName}
            onChange={handleChange}
          />
        ) : (
          currentProduct.productName
        )}
      </td>
      <td className="border px-2 py-1 align-top">
        {isEditing ? (
          <input
            className="border px-1"
            type="text"
            name="scrumMasterName"
            value={editedProduct.scrumMasterName}
            onChange={handleChange}
          />
        ) : (
          currentProduct.scrumMasterName
        )}
      </td>
      <td className="border px-2 py-1 align-top">
        {isEditing ? (
          <input
            className="border px-1"
            type="text"
            name="productOwnerName"
            value={editedProduct.productOwnerName}
            onChange={handleChange}
          />
        ) : (
          currentProduct.productOwnerName
        )}
      </td>
      <td className="border px-2 py-1 align-top whitespace-break-spaces">
        {isEditing ? (
          <div>
            {editedProduct.developers.map((developer, index) => (
              <div key={index} className="flex items-center">
                <button
                  className="text-white font-bold px-1 my-0.5 rounded bg-red-500 hover:bg-red-600 "
                  onClick={() => handleRemoveDeveloper(index)}
                >
                  Remove
                </button>
                <input
                  className="border px-1 ml-1"
                  type="text"
                  name={`developer-${index}`}
                  value={developer}
                  onChange={(event) => {
                    // Create a copy of the dev list and modify the edited dev
                    const newDevelopers = [...editedProduct.developers];
                    newDevelopers[index] = event.target.value;
                    // Save the edited version to the state
                    setEditedProduct({
                      ...editedProduct,
                      developers: newDevelopers,
                    });
                  }}
                />
              </div>
            ))}
            <div className="flex items-center mt-1">
              <button
                className="text-white font-bold px-1 my-0.5 rounded bg-green-500 hover:bg-green-600 mx-auto"
                onClick={handleAddDeveloper}
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          currentProduct.developers.join("\n")
        )}
      </td>
      <td className="border px-2 py-1 align-top">
        {isEditing ? (
          <input
            className="border px-1"
            type="date"
            name="startDate"
            value={editedProduct.startDate}
            onChange={handleChange}
          />
        ) : (
          currentProduct.startDate
        )}
      </td>
      <td className="border px-2 py-1 align-top">
        {isEditing ? (
          <input
            className="border px-1 w-20"
            type="text"
            name="methodology"
            value={editedProduct.methodology}
            onChange={handleChange}
          />
        ) : (
          currentProduct.methodology
        )}
      </td>
      <td className="border px-2 py-1 align-top">
        {isEditing ? (
          <div className="flex flex-col">
            <div className="w-full">
              <button
                className="w-full text-white font-bold px-1 my-0.5 rounded bg-green-500 hover:bg-green-600"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
            <div className="w-full">
              <button
                className="w-full text-white font-bold px-1 my-0.5 rounded bg-red-500 hover:bg-red-600"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              className="w-full text-white font-bold px-1 my-0.5 rounded bg-blue-500 hover:bg-blue-600"
              onClick={handleEdit}
            >
              Edit
            </button>
            <button
              className="w-full text-white font-bold px-1 my-0.5 rounded bg-red-500 hover:bg-red-600"
              onClick={handleDelete}
              onMouseLeave={(event) => {
                setIsDeleting(false);
              }}
            >
              {isDeleting ? "Confirm" : "Delete"}
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

export default ProductEntry;
