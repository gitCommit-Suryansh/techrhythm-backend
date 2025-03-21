const usermodel = require("../model/user");
const xlsx = require("xlsx"); // ✅ Import xlsx for Excel parsing
const axios = require("axios"); // ✅ Import Axios

exports.verifyPass = async (req, res) => {
  const { passId } = req.body;

  try {
    // Find the user by passId
    const user = await usermodel.findOne({ passId });

    if (!user) {
      return res.status(404).json({ verified: false });
    }

    // Perform any operations you need with the found user
    // For example, mark the pass as verified or log the verification

    return res.status(200).json({ verified: true, userId: user._id });
  } catch (error) {
    console.error("Error verifying pass:", error);
    return res.status(500).json({ verified: false, error: error.message });
  }
};

exports.checkIn = async (req, res) => {
  const { userId } = req.body;
  console.log("Received request body:", req.body); // Debugging

  try {
    // Find the user by userId
    const user = await usermodel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the user's checkIn status
    user.checkedIn = true;
    await user.save();

    return res.status(200).json({ message: "Check-in successful." });
  } catch (error) {
    console.error("Error during check-in:", error);
    return res
      .status(500)
      .json({ message: "Error during check-in.", error: error.message });
  }
};

// Function to determine pass type
const getPassType = (amount) => {
  if (amount === 199) return "BRONZE";
  if (amount === 599) return "SILVER";
  if (amount === 999) return "GOLD";
  if (amount === 1699) return "PLATINUM";
  return null;
};

exports.updatePass = async (req, res) => {
  try {
    const { googleDriveFileId } = req.body;
    if (!googleDriveFileId)
      return res.status(400).json({ error: "No file ID provided" });

    const fileUrl = `https://drive.google.com/uc?export=download&id=${googleDriveFileId}`;

    // Download Excel File from Google Drive
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const workbook = xlsx.read(response.data, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    //   const data = xlsx.utils.sheet_to_json(sheet);

      let updatedCount = 0;
   
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 }); // Read as an array of arrays

    // Extract headers from the second row (index 1)
    const headers = data[1];
    console.log("Extracted Headers:", headers);

    // Remove the first two rows (title row + headers)
    const formattedData = data.slice(2).map((row) => {
      let obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index]; // Map values to headers
      });
      return obj;
    });

    for (let row of formattedData) {
      // console.log("Processing row:", row);

      const Reciept = row["Reciept"];
      const Amount = row["Amount"];
      const Email = row["Email"];
      const Mobile = row["Mobile"];
      const Status = row["Status"];

      if (Status !== "Success") continue;  


      if (!Email || !Reciept || !Amount) continue;

      let user =
        (await usermodel.findOne({ email: Email })) ||
        (await usermodel.findOne({ phone: Mobile }));

      if (user && !user.passId) {
        user.passId = Reciept;
        user.passType = getPassType(Amount);
        user.passAmount=Amount;
        await user.save();
        updatedCount++;
      }
    }

    res.json({ message: `✅ Successfully updated ${updatedCount} users!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing the file" });
  }
};
