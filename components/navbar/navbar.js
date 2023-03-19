import { jsonToCsv, downloadCsv } from "@/utils/util";
import csvtojson from "csvtojson";
import {
  Button,
  Popover,
  Form,
  FormLayout,
  TextField,
  DropZone,
  LegacyStack,
  Thumbnail,
  Spinner,
  Text,
  Loading,
  Frame,
} from "@shopify/polaris";
import { Modal } from "@shopify/polaris";
import React, { useState, useCallback, useRef } from "react";

function Navbar({ prodctData, setProductData }) {
  const [active, setActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const csvInput = useRef(null);
  const [id, setId] = useState(0);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState(0);
  const [count, setCount] = useState(0);
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);

  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const modalOpen = useCallback(() => setIsModalOpen((active) => !active), []);
  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) => setFile(acceptedFiles[0]),
    [file]
  );

  //Image upload handle
  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
  const fileUpload = !file && <DropZone.FileUpload />;
  const uploadedFile = file && (
    <LegacyStack>
      <Thumbnail
        size="large"
        alt={file.name}
        source={
          validImageTypes.includes(file.type)
            ? window.URL.createObjectURL(file)
            : NoteMinor
        }
      />
      <div>
        {file.name}{" "}
        <Text variant="bodySm" as="p">
          {file.size} bytes
        </Text>
      </div>
    </LegacyStack>
  );

  const activator = (
    <Button onClick={toggleActive} disclosure>
      More actions
    </Button>
  );

  //Adding new product to the list

  async function handleSubmit() {
    if (
      id == 0 ||
      title == "" ||
      price == 0 ||
      description == "" ||
      category == "" ||
      rate == 0 ||
      count == 0 ||
      file == null
    ) {
      alert("All field are required");
      return;
    }
    setLoading(true);
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dupfwiwnp/image/upload`;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "wj1iznqd");
    data.append("cloud_name", "dupfwiwnp");
    try {
      const res = await fetch(cloudinaryUrl, {
        method: "post",
        body: data,
      });
      const json = await res.json();
      const url = json.url;
      let addedProduct = {
        id: id,
        title: title,
        price: price,
        description: description,
        category: category,
        rating: { rate: rate, count: count },
        image: url,
      };
      setProductData([addedProduct, ...prodctData]);
      setIsModalOpen(false);
      setLoading(false);
      alert("Product added successfully");
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  const handleIdChange = (value) => {
    setId(value);
  };
  const handleTitleChange = useCallback((value) => setTitle(value), [title]);
  const handlePriceChange = useCallback((value) => setPrice(value), [price]);
  const handleDescriptionChange = useCallback(
    (value) => setDescription(value),
    [description]
  );
  const handleRateChange = useCallback((value) => setRate(value), [rate]);
  const handleCountChange = useCallback((value) => setCount(value), [count]);
  const handleCategoryChange = useCallback(
    (value) => setCategory(value),
    [category]
  );

  //Download as CSV data
  const handleClick = () => {
    const csv = jsonToCsv(prodctData);
    downloadCsv(csv);
  };

  //CSV data to JSON, Bulk upload
  const handleFileChange = (event) => {
    setIsLoading(true);
    const file = event.target.files[0];
    handleCsvUpload(file);
  };

  const handleCsvUpload = (file) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async () => {
      const data = await csvtojson().fromString(reader.result);
      setProductData([...data, ...prodctData]);
      alert("All products added");
      setIsLoading(false);
    };
  };

  return (
    <>
      {isLoading ? (
        <div style={{ height: "100px" }}>
          <Frame>
            <Loading />
          </Frame>
        </div>
      ) : (
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
                onClick={() => csvInput.current.click()}
                href="#"
                className="inline-block text-sm px-4 py-2 font-medium mt-4 lg:mt-0"
              >
                Export
              </a>
              <input
                className="export"
                ref={csvInput}
                type="file"
                onChange={handleFileChange}
              />
            </div>
            <div>
              <a
                onClick={handleClick}
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
                  <hr />
                  <li className="py-2 px-5 font-bold  hover:bg-black hover:text-white">
                    Option B
                  </li>
                </ul>
              </Popover>
            </div>
            <Button onClick={modalOpen} primary>
              Add Product
            </Button>
          </div>
        </nav>
      )}
      {/* Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Product"
      >
        <Modal.Section>
          {loading ? (
            <Spinner accessibilityLabel="Small spinner example" size="small" />
          ) : (
            <Form
              noValidate
              onSubmit={() => {
                handleSubmit();
              }}
            >
              <FormLayout>
                <TextField
                  value={id}
                  onChange={handleIdChange}
                  label="Product Id"
                  type="number"
                  autoComplete="off"
                />
                <TextField
                  value={title}
                  onChange={handleTitleChange}
                  label="Title"
                  type="text"
                  autoComplete="off"
                  // error="Title name is required"
                />
                <TextField
                  value={price}
                  onChange={handlePriceChange}
                  label="Price"
                  type="number"
                  autoComplete="off"
                  prefix="$"
                />
                <TextField
                  value={description}
                  onChange={handleDescriptionChange}
                  label="Description"
                  type="text"
                  autoComplete="off"
                  multiline={4}
                />
                <TextField
                  value={category}
                  onChange={handleCategoryChange}
                  label="Category"
                  type="text"
                  autoComplete="off"
                />
                <TextField
                  value={rate}
                  onChange={handleRateChange}
                  label="Rating"
                  type="number"
                  autoComplete="off"
                />
                <TextField
                  value={count}
                  onChange={handleCountChange}
                  label="Rated by"
                  type="number"
                  autoComplete="off"
                  placeholder="No.of Customers"
                  align="left"
                />
                <DropZone
                  label="Product Image"
                  allowMultiple={false}
                  onDrop={handleDropZoneDrop}
                >
                  {uploadedFile}
                  {fileUpload}
                </DropZone>
                <Button fullWidth>Cancel</Button>
                <Button fullWidth primary submit>
                  Submit
                </Button>
              </FormLayout>
            </Form>
          )}
        </Modal.Section>
      </Modal>
    </>
  );
}

export default Navbar;
