import React, { useState, useEffect, useCallback, useRef } from "react";
import ProductEntry from "../components/product-entry";
import AddProductMenu from "../components/add-product-menu";

const IndexPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(null);

  const pingIntervalId = useRef(null);


  const fetchProducts = useCallback(() => {
    return fetch(`http://localhost:3000/api/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Server not available");
        }
        return response.json();
      })
      .then((resultData) => {
        setProducts(resultData);
        return true;
      })
      .catch((error) => {
        return false;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setProducts, setIsLoading]);


  const checkStatus = useCallback(() => {
    fetch("http://localhost:3000/api/ping")
      .then((response) => {
        if (response.status === 200) {
          fetchProducts();
          setError(null);
          clearInterval(pingIntervalId.current);
        }
      })
      .catch((error) => console.log(error));
  }, [fetchProducts]);


  const setErrorAndWait = useCallback((msg) => {
    setError(msg);
    pingIntervalId.current = setInterval(checkStatus, 5000);
  }, [checkStatus]);


  useEffect(() => {
    fetchProducts().then((result) => {
      if (!result) {
        setErrorAndWait(
          "Getting products failed:\nAPI Likely down. The page will reload when the API is deemed operational."
        );
      }
    });
  }, [fetchProducts, setErrorAndWait]);


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filteredProducts = products.filter((product) =>
      (
        product.scrumMasterName.toLowerCase() +
        product.developers.join(" ").toLowerCase()
      ).includes(event.target.value.toLowerCase())
    );
    setFilteredProducts(filteredProducts);
  };


  // Remove a product from the list of products
  const removeProduct = (productId) => {
    // Filter out removed product by ID
    const updatedProducts = products.filter(
      (product) => product.productId !== productId
    );
    setProducts(updatedProducts);
  };


  const handleAddProductButton = () => {
    setIsAddingProduct(!isAddingProduct);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold underline mb-5 mt-1 w-full text-center">
        BC Webapp Manager Dashboard
      </h1>
      <div className="flex justify-center mb-5">
        <input
          type="text"
          placeholder="Search developers / scrum masters..."
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-400 rounded py-2 px-3 w-1/2 max-w-2xl mr-2"
        />
        <button
          onClick={handleAddProductButton}
          className={(isAddingProduct ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600") + " text-white font-bold py-2 px-4 rounded"}
        >
        {isAddingProduct ? "Cancel" : "Add New Product"}
        </button>
      </div>
      {isLoading ? (
        <p className="w-full text-center text-green-500">Loading...</p>
      ) : error ? (
        <p className="w-full text-center text-red-500 whitespace-break-spaces">
          {error}
        </p>
      ) : (
        <div className="flex w-full">
          <table className="m-auto border-collapse table-auto text-sm">
            <thead className="table-header-group">
              <tr>
                <th className="border px-2 py-1 align-top text-left">ID</th>
                <th className="border px-2 py-1 align-top text-left">Name</th>
                <th className="border px-2 py-1 align-top text-left">
                  Scrum Master
                </th>
                <th className="border px-2 py-1 align-top text-left">Owner</th>
                <th className="border px-2 py-1 align-top text-left">
                  Developers
                </th>
                <th className="border px-2 py-1 align-top text-left">
                  Start Date
                </th>
                <th className="border px-2 py-1 align-top text-left">
                  Methodology
                </th>
                {/*The following is an empty header for the edit row */}
                <th className="border px-2 py-1 align-top text-left">
                  Options
                </th>
              </tr>
            </thead>
            <tbody>
              {isAddingProduct ? <AddProductMenu setErrorAndWait={setErrorAndWait} setIsAddingProduct={setIsAddingProduct}></AddProductMenu> : null}
              {/* Render product entries */}
              {(filteredProducts === null ? products : filteredProducts).map(
                (product) => (
                  <ProductEntry
                    key={product.productId}
                    product={product}
                    removeProduct={removeProduct}
                    setErrorAndWait={setErrorAndWait}
                  ></ProductEntry>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
