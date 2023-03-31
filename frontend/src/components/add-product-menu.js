import React, { useState } from "react";

function AddProductMenu({setErrorAndWait, setIsAddingProduct, fetchProducts}) {
  // Define state used for stacking and applying edits
  const [editedProduct, setEditedProduct] = useState({
    "developers": [
      ""
    ],
    "methodology": "",
    "productName": "",
    "productOwnerName": "",
    "scrumMasterName": "",
    "startDate": "1970-01-01"
  });

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
    setEditedProduct({
      ...editedProduct,
      [event.target.name]: event.target.value,
    });
  };

  // Save button clicked
  const handleCreate = () => {
    const { developers, methodology, productName, productOwnerName, scrumMasterName, startDate } = editedProduct;

    // Check if any fields are empty.
    const emptyDevs = developers.filter((developer) => developer.trim().length === 0);
    const requiredFields = [methodology, productName, productOwnerName, scrumMasterName, startDate];
    const hasEmptyFields = emptyDevs.length > 0 || requiredFields.some((field) => field.trim().length === 0) || developers.length === 0;
  
    if (hasEmptyFields) {
      alert("Please fill out all fields.");
      return;
    }

    // Send POST to BCWS API with updated information
    fetch("http://localhost:3000/api/products", {
      method: "PUT",
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
      .then(setIsAddingProduct(false))
      .then(fetchProducts())
      .catch((error) => {
        // If this fails, display an error and reload data once api healthy again.
        setErrorAndWait(
          "Add product failed:\nAPI Likely down. The page will reload when the API is deemed operational."
        );
      });
  };

  return (
    <tr>
      <td className="border px-2 py-1 align-top">N/A</td>
      <td className="border px-2 py-1 align-top">
        {
          <input
            className="border px-1"
            type="text"
            name="productName"
            value={editedProduct.productName}
            onChange={handleChange}
          />
        }
      </td>
      <td className="border px-2 py-1 align-top">
        {
          <input
            className="border px-1"
            type="text"
            name="scrumMasterName"
            value={editedProduct.scrumMasterName}
            onChange={handleChange}
          />
        }
      </td>
      <td className="border px-2 py-1 align-top">
        {
          <input
            className="border px-1"
            type="text"
            name="productOwnerName"
            value={editedProduct.productOwnerName}
            onChange={handleChange}
          />
        }
      </td>
      <td className="border px-2 py-1 align-top whitespace-break-spaces">
        {
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
        }
      </td>
      <td className="border px-2 py-1 align-top">
        {
          <input
            className="border px-1"
            type="date"
            name="startDate"
            value={editedProduct.startDate}
            onChange={handleChange}
          />
        }
      </td>
      <td className="border px-2 py-1 align-top">
        {
          <input
            className="border px-1 w-20"
            type="text"
            name="methodology"
            value={editedProduct.methodology}
            onChange={handleChange}
          />
        }
      </td>
      <td className="border px-2 py-1 align-top">
        {
            <div className="w-full">
              <button
                className="w-full text-white font-bold px-1 my-0.5 rounded bg-green-500 hover:bg-green-600"
                onClick={handleCreate}
              >
                Create
              </button>
            </div>
        }
      </td>
    </tr>
  );
}

export default AddProductMenu;
