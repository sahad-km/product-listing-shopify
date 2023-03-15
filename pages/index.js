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
} from "@shopify/polaris";
import { useState, useCallback, useEffect, useRef } from "react";
import Navbar from "@/components/navbar/navbar";

export default function IndexTableWithFilteringExample() {
  //data table
  const [apiData,setApiData] = useState([]);
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

  const handleFiltersQueryChange = useCallback(
    (value) => {
      setQueryValue(value);
      console.log(value);
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

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data), console.log(apiData);
      })
      .catch((error) => console.error(error));
  }, []);

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

  //tabs
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );
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

  //modal of products

  const [active, setActive] = useState(false);
  const button = useRef();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setActive(true);
  };

  const handleClose = useCallback(() => {
    setActive(false);
  }, []);

  //index table

  const emptyStateMarkup = (
    <EmptySearchResult
      title={'No products yet'}
      description={'Try changing the filters or search term'}
      withIllustration
    />
  );

  const customers = [
    {
      id: "3411",
      url: "#",
      name: "Mae Jemison",
      location: "Decatur, USA",
      orders: 20,
      amountSpent: "$2,400",
    },
    {
      id: "2561",
      url: "#",
      name: "Ellen Ochoa",
      location: "Los Angeles, USA",
      orders: 30,
      amountSpent: "$140",
    },
  ];

  const resourceName = {
    singular: "product",
    plural: "products",
  };
  
    const rowMarkup = (filteredData.length === 0 && !queryValue ? products : filteredData).map(
      (product,index) => (
        <IndexTable.Row  id={product.id} key={index} onClick={() => console.log(`Clicked on product ${product.id}`)} >
          <IndexTable.Cell>
            <Thumbnail source={product.image} size="small" />
          </IndexTable.Cell>
          <IndexTable.Cell>
            <p className="truncate">{product.title}</p>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Badge status="success">
              <p style={{ fontSize: "1.2em" }}>Active</p>
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
      )
    );
  

  return (
    <>
      <Navbar />
      <div className="w-[80%] mx-auto">
        <LegacyCard>
          <Tabs
            tabs={tabs}
            selected={selected}
            onSelect={handleTabChange}
            disclosureText="More views"
          >
            <LegacyCard.Section title={tabs[selected].content}>
              <p>Tab {selected} selected</p>
            </LegacyCard.Section>
          </Tabs>

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
            resourceName={resourceName}
            itemCount={filteredData.length === 0 && !queryValue ? products.length : filteredData.length}
            headings={[
              { title: ''},
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
            // stickyHeader
            selectable={false}
          >
            {rowMarkup}
          </IndexTable>
        </LegacyCard>
      </div>

      {/* Modal */}

      <div style={{ height: "500px" }}>
        <Modal
          instant
          open={active}
          onClose={handleClose}
          title="Reach more shoppers with Instagram product tags"
          primaryAction={{
            content: "Add Instagram",
            onAction: handleClose,
          }}
          secondaryActions={[
            {
              content: "Learn more",
              onAction: handleClose,
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <p>
                Use Instagram posts to share your products with millions of
                people. Let shoppers buy from your store without leaving
                Instagram.
              </p>
            </TextContainer>
          </Modal.Section>
        </Modal>
      </div>
    </>
  );

  function disambiguateLabel(key, value) {
    switch (key) {
      case "taggedWith":
        return `Tagged with ${value}`;
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
