import React, { useState, useEffect } from "react";


const tableElementClasses = "border px-2 py-1 align-top";

function ProductEntry({ product, editingId }) {

  return (
        <tr key={product.productId}>
          <td className={tableElementClasses}>{product.productId}</td>
          <td className={tableElementClasses}>{product.productName}</td>
          <td className={tableElementClasses}>{product.scrumMasterName}</td>
          <td className={tableElementClasses}>
            {product.productOwnerName}
          </td>
          <td className="border px-4 py-2 whitespace-break-spaces">
            {product.developers.join("\n")}
          </td>
          <td className={tableElementClasses}>{product.startDate}</td>
          <td className={tableElementClasses}>{product.methodology}</td>
        </tr>
  );
}

export default ProductEntry;
