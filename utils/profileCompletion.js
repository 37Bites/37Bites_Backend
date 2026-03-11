export const calculateProfileCompletion = (admin) => {

  const fields = [
    admin.name,
    admin.email,
    admin.mobile,
    admin.address?.fullAddress,
    admin.address?.city,
    admin.address?.state,
    admin.address?.country,
    admin.address?.postalCode,
    admin.address?.landmark,
    admin.profileImage?.url,
  ];

  const filled = fields.filter(
    (item) => item && String(item).trim() !== ""
  ).length;

  return Math.round((filled / fields.length) * 100);
};