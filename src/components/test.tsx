import React from "react";
import { Avatar, Row, Col } from "antd";

const ProfileUI = () => {
  return (
    <>
      <div style={styles.userInfoSection}>
        <Row style={{ marginTop: 150 }}>
          <Avatar
            src="https://instagram.fecn4-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/126826478_417495705945344_4969899802994786895_n.jpg?_nc_ht=instagram.fecn4-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=vCm-qA4wvyoAX_zik4v&tp=1&oh=a9851f06328b180816efda5b0bd01538&oe=5FE6A820"
            size={180}
          />
          <div style={{ marginLeft: 20 }}>
            <p
              style={{
                marginTop: 15,
                marginBottom: 5,
                fontSize: 19,
                fontWeight: "bold",
              }}
            >
              {"currentAdvisor.title_name"}
            </p>
            <p style={styles.caption}>{"currentAdvisor.faculty"}</p>
          </div>
        </Row>
      </div>
    </>
  );
};

const styles = {
  screen: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 200,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    // lineHeight: 14,
    fontWeight: 500,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
};

export default ProfileUI;
