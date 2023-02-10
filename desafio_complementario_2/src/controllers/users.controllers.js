export const getRegister = async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.log(error);
  }
};

export const getLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error);
  }
};

export const getLogout = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};
