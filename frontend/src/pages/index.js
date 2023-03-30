import React, { useState, useEffect } from "react";
import ProductEntry from "../components/product-entry";

const tableElementClasses = "border px-2 py-1 align-top";

const IndexPage = () => {
  const [products, setProducts] = useState(null);
  useEffect(() => {
    fetch(`http://localhost:3000/api/products`)
      .then((response) => response.json())
      .then((resultData) => {
        setProducts(resultData);
      });
  }, []);

  const [editingId, setEditingId] = useState(-1);

  const handleNameChange = (e) => {
    console.log(e);
    //const newName = e.target.value;
    //this.setState({
    //  name: newName
    //});
  };

  return (
    <div>
      <h1 className="text-3xl font-bold underline mb-5 mt-1 w-full text-center">
        BC Webapp Manager Dashboard
      </h1>
      <div className="flex w-full">
        <table className="m-auto border-collapse table-auto text-sm">
          <thead className="table-header-group">
            <tr>
              <th className={tableElementClasses}>ID</th>
              <th className={tableElementClasses}>Name</th>
              <th className={tableElementClasses}>Scrum Master</th>
              <th className={tableElementClasses}>Owner</th>
              <th className={tableElementClasses}>Developers</th>
              <th className={tableElementClasses}>Start Date</th>
              <th className={tableElementClasses}>Methodology</th>
            </tr>
          </thead>
          <tbody>
          {products && products.map((product) => (
            <ProductEntry product={product} editingId={-1}></ProductEntry>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndexPage;
