import {
  Badge,
  IndexTable,
  LegacyCard,
  Filters,
  ChoiceList,
  Modal,
  TextContainer,
  EmptySearchResult,
  Text,
  Tabs,
  Thumbnail,
  Button,
  Divider,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import Navbar from "@/components/navbar/navbar";

export default function IndexTableWithFilteringExample() {
  const [products, setProducts] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [productType, setProductType] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [queryValue, setQueryValue] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const handleAvailabilityChange = useCallback(
    (value) => setAvailability(value),
    []
  );
  const handleProductTypeChange = useCallback(
    (value) => setProductType(value),
    []
  );
  const handleVendorChange = useCallback((value) => setVendor(value), []);

  //Product filter handling

  const handleFiltersQueryChange = useCallback(
    (value) => {
      setQueryValue(value);
      const newFilter = products.filter((product) => {
        return product.title.toLowerCase().includes(value.toLowerCase());
      });
      if (queryValue === null) {
        setFilteredData([]);
      } else {
        setFilteredData(newFilter);
      }
    },
    [queryValue]
  );

  const handleAvailabilityRemove = useCallback(() => setAvailability(null), []);
  const handleProductTypeRemove = useCallback(() => setProductType(null), []);
  const handleVendorRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
  const handleFiltersClearAll = useCallback(() => {
    handleAvailabilityRemove();
    handleProductTypeRemove();
    handleVendorRemove();
    handleQueryValueRemove();
  }, [
    handleAvailabilityRemove,
    handleQueryValueRemove,
    handleProductTypeRemove,
    handleVendorRemove,
  ]);

  //Fetching product data from API
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error(error));
  }, []);

  //Availability filter clear

  const clearAvailabilty = useCallback(
    () => (
      <Button
        plain
        onClick={() => {
          setAvailability([]);
        }}
      >
        Cancel
      </Button>
    ),
    []
  );

  //Product type filter clear

  const clearProductType = useCallback(
    () => (
      <Button
        plain
        onClick={() => {
          setProductType([]);
        }}
      >
        Cancel
      </Button>
    ),
    []
  );

  //Vendor filter clear

  const clearVendor = useCallback(
    () => (
      <Button
        plain
        onClick={() => {
          setVendor([]);
        }}
      >
        Cancel
      </Button>
    ),
    []
  );

  //Defining all filters

  const filters = [
    {
      key: "availability",
      label: "Purchase Availability",
      filter: (
        <ChoiceList
          title="Availability"
          titleHidden
          choices={[
            { label: "Online Store", value: "Online Store" },
            { label: "Point of Sale", value: "Point of Sale" },
            {
              label: "Buy Button",
              value: "Buy Button",
              renderChildren: clearAvailabilty,
            },
          ]}
          selected={availability || []}
          onChange={handleAvailabilityChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "productType",
      label: "Product Type",
      filter: (
        <ChoiceList
          title="Product type"
          titleHidden
          choices={[
            { label: "T-Shirt", value: "T-Shirt" },
            { label: "Accessory", value: "Accessory" },
            {
              label: "Gift card",
              value: "Gift card",
              renderChildren: clearProductType,
            },
          ]}
          selected={productType || []}
          onChange={handleProductTypeChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "vendor",
      label: "Vendor",
      filter: (
        <ChoiceList
          title="Vendor"
          titleHidden
          choices={[
            { label: "Company 123", value: "Company 123" },
            { label: "Boring Rock", value: "Boring Rock" },
            { label: "Rustic LTD", value: "Rustic LTD" },
            {
              label: "Partners - Demo",
              value: "Partners - Demo",
              renderChildren: clearVendor,
            },
          ]}
          selected={vendor || []}
          onChange={handleVendorChange}
          allowMultiple
        />
      ),
    },
  ];

  //To show applied filter as label

  const appliedFilters = [];
  if (!isEmpty(availability)) {
    const key = "availability";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, availability),
      onRemove: handleAvailabilityRemove,
    });
  }
  if (!isEmpty(productType)) {
    const key = "productType";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, productType),
      onRemove: handleProductTypeRemove,
    });
  }
  if (!isEmpty(vendor)) {
    const key = "vendor";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, vendor),
      onRemove: handleVendorRemove,
    });
  }

  // Tabs selection based product list

  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => {
      setSelected(selectedTabIndex);
      let newFilter;
      if (selectedTabIndex == 0) {
        setFilteredData([]);
      }
      if (selectedTabIndex == 1) {
        newFilter = products.filter((product) => {
          return product.rating.count > 100 && product.rating.count < 200;
        });
        setFilteredData(newFilter);
      }
      if (selectedTabIndex == 2) {
        newFilter = products.filter((product) => {
          return product.rating.count < 100;
        });
        setFilteredData(newFilter);
      }
      if (selectedTabIndex == 3) {
        newFilter = products.filter((product) => {
          return product.rating.count > 200;
        });
        setFilteredData(newFilter);
      }
    },
    [selected]
  );

  //Defining all tabs

  const tabs = [
    {
      id: "all-customers-4",
      content: "All",
      accessibilityLabel: "All customers",
      panelID: "all-customers-content-4",
    },
    {
      id: "accepts-marketing-4",
      content: "Active",
      panelID: "accepts-marketing-content-4",
    },
    {
      id: "repeat-customers-4",
      content: "Draft",
      panelID: "repeat-customers-content-4",
    },
    {
      id: "prospects-4",
      content: "Archived",
      panelID: "prospects-content-4",
    },
  ];

  //Selected product modal

  const [active, setActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setActive(true);
  };

  const handleClose = useCallback(() => {
    setActive(false);
  }, []);

  //Index table

  const emptyStateMarkup = (
    <EmptySearchResult
      title={"No products yet"}
      description={"Try changing the filters or search term"}
      withIllustration
    />
  );

  const resourceName = {
    singular: "product",
    plural: "products",
  };

  const rowMarkup = (
    filteredData.length === 0 && !queryValue && selected == 0
      ? products
      : filteredData
  ).map((product, index) => (
    <IndexTable.Row id={product.id} key={index}>
      <IndexTable.Cell>
        <Thumbnail source={product.image} size="small" />
      </IndexTable.Cell>
      <IndexTable.Cell>
        <p
          onClick={() => {
            handleProductClick(product);
          }}
          className="truncate"
        >
          {product.title}
        </p>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge status="success">
          <p style={{ fontSize: "1.2em" }}>
            {product.rating.count > 200
              ? "Archived"
              : product.rating.count > 100
              ? "Active"
              : "Draft"}
          </p>
        </Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" alignment="start">
          1814
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" alignment="start">
          Outdoor
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" alignment="start">
          Rustic LTD
        </Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <>
      <Navbar prodctData={products} setProductData={setProducts} />
      <div className="w-[80%] mx-auto">
        <LegacyCard>
          <Tabs
            tabs={tabs}
            selected={selected}
            onSelect={handleTabChange}
            disclosureText="More views"
          ></Tabs>
          <Filters
            queryPlaceholder="Filter Items"
            queryValue={queryValue}
            filters={filters}
            appliedFilters={appliedFilters}
            onQueryChange={handleFiltersQueryChange}
            onQueryClear={handleQueryValueRemove}
            onClearAll={handleFiltersClearAll}
          />
          <IndexTable
            emptyState={emptyStateMarkup}
            resourceName={resourceName}
            itemCount={
              filteredData.length === 0 && !queryValue
                ? products.length
                : filteredData.length
            }
            headings={[
              { title: "" },
              {
                title: (
                  <Text
                    as="p"
                    fontWeight="semibold"
                    variant="bodyMd"
                    alignment="start"
                  >
                    Product
                  </Text>
                ),
              },
              {
                title: (
                  <Text
                    as="p"
                    fontWeight="semibold"
                    variant="bodyMd"
                    alignment="start"
                  >
                    Status
                  </Text>
                ),
              },
              {
                title: (
                  <Text
                    as="p"
                    fontWeight="semibold"
                    variant="bodyMd"
                    alignment="start"
                  >
                    Inventory
                  </Text>
                ),
              },
              {
                title: (
                  <Text
                    as="p"
                    fontWeight="semibold"
                    variant="bodyMd"
                    alignment="start"
                  >
                    Type
                  </Text>
                ),
              },
              {
                title: (
                  <Text
                    as="p"
                    fontWeight="semibold"
                    variant="bodyMd"
                    alignment="start"
                  >
                    Vendor
                  </Text>
                ),
              },
            ]}
            stickyHeader
            selectable={false}
          >
            {rowMarkup}
          </IndexTable>
        </LegacyCard>
      </div>

      {/* Modal */}

      {selectedProduct && (
        <div style={{ height: "500px" }}>
          <Modal
            // instant
            open={active}
            onClose={handleClose}
            title={selectedProduct.title}
          >
            <Modal.Section>
              <TextContainer>
                <img
                  className="w-[30%] mx-auto h-30"
                  src={selectedProduct.image}
                />
                <Divider borderStyle="dark" />
                <h1 className="font-semibold text-lg px-5 ">A Description:</h1>
                <p className="px-5">{selectedProduct.description}</p>
                <Divider borderStyle="dark" />
                <h1 className="font-semibold text-lg px-5 ">Rating:</h1>
                <p className="px-5">
                  <span className="font-semibold">Rating:</span>{" "}
                  {selectedProduct.rating.rate}
                </p>
                <p className="px-5">
                  <span className="font-semibold">Rated By:</span>{" "}
                  {selectedProduct.rating.count} customers
                </p>
              </TextContainer>
            </Modal.Section>
          </Modal>
        </div>
      )}
    </>
  );

  function disambiguateLabel(key, value) {
    switch (key) {
      case "availability":
        return `Available on ${value}`;
      case "vendor":
        return `Available from ${value}`;
      case "productType":
        return `${value}`;
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}
