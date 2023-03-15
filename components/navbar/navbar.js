import { Button, Popover, ActionList } from "@shopify/polaris";

import React, { useState, useCallback } from "react";

function Navbar() {
  const [active, setActive] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const handleImportedAction = useCallback(
    () => console.log("Imported action"),
    []
  );

  const handleExportedAction = useCallback(
    () => console.log("Exported action"),
    []
  );

  const activator = (
    <Button onClick={toggleActive} disclosure>
      More actions
    </Button>
  );
  return (
    <nav className="flex items-center justify-between flex-wrap  p-6">
      <div className="flex items-center flex-shrink-0 text-black mr-6">
        <span className="font-semibold tracking-tight pl-10 text-2xl ml-20">
          Products
        </span>
      </div>
      <div className="block lg:hidden">
        <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow"></div>
        <div>
          <a
            href="#"
            className="inline-block text-sm px-4 py-2 font-medium mt-4 lg:mt-0"
          >
            Export
          </a>
        </div>
        <div>
          <a
            href="#"
            className="inline-block text-sm px-4 py-2 font-medium mt-4 lg:mt-0"
          >
            Import
          </a>
        </div>
        <div className="mr-3">
          <Popover
            active={active}
            activator={activator}
            autofocusTarget="first-node"
            onClose={toggleActive}
          >
            <ul>
              <li className="py-2 px-5 font-bold hover:bg-black hover:text-white">
                Option A
              </li>
              <hr/>
              <li  className="py-2 px-5 font-bold  hover:bg-black hover:text-white">
                Option B
              </li>
            </ul>
          </Popover>
        </div>
        <Button primary>Add Product</Button>
      </div>
    </nav>
  );
}

export default Navbar;
