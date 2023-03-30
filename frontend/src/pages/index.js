import React, { useState, useEffect } from "react"

const tdClasses = "border px-2 py-1 align-top"
const IndexPage = () => {
  const [products, setProducts] = useState(null)
  useEffect(() => {
    fetch(`http://localhost:3000/api/products`)
      .then(response => response.json())
      .then(resultData => {setProducts(resultData)})
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold underline">BC Webapp Manager Dashboard</h1>
      <table className="border-collapse table-auto text-sm">
        <thead className="table-header-group">
          <tr>
            <th className={tdClasses}>ID</th>
            <th className={tdClasses}>Name</th>
            <th className={tdClasses}>Scrum Master</th>
            <th className={tdClasses}>Owner</th>
            <th className={tdClasses}>Developers</th>
            <th className={tdClasses}>Start Date</th>
            <th className={tdClasses}>Methodology</th>
          </tr>
        </thead>
        <tbody>
        {products && products.map(product => (
          <tr key={product.productId}>
            <td className={tdClasses}>{product.productId}</td>
            <td className={tdClasses}>{product.productName}</td>
            <td className={tdClasses}>{product.scrumMasterName}</td>
            <td className={tdClasses}>{product.productOwnerName}</td>
            <td className="border px-4 py-2 whitespace-break-spaces">{product.developers.join("\n")}</td>
            <td className={tdClasses}>{product.startDate}</td>
            <td className={tdClasses}>{product.methodology}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default IndexPage