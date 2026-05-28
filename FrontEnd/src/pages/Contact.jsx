import Card from "../components/Card";
import styles from "../components/styles/Contact.module.css";

const contacts = [
  {
    id: 1,
    profileImg: "https://avatars.githubusercontent.com/u/203020275?v=4",
    name: "Rebeca Luiza Soares Cerqueira",
    studentNumber: 224,
    gitHubLink: "https://github.com/Rebeca-Soares",
  },
  {
    id: 2,
    profileImg: "https://avatars.githubusercontent.com/u/168200274?v=4",
    name: "Natália Carvalho de Pinho Joaquim",
    studentNumber: 219,
    gitHubLink: "https://github.com/natipinho",
  },
];

function ContactCard() {
  const contactDetails = contacts.map((contact) => (
    <div key={contact.id} className={styles.card}>
      <img
        src={contact.profileImg}
        alt={contact.name}
        className={styles.profileImg}
      />
      <div className={styles.info}>
        <b className={styles.name}>{contact.name}</b>
        <p className={styles.detail}>Student Number: {contact.studentNumber}</p>
        <a
          href={contact.gitHubLink}
          className={styles.link}
          target="_blank"
          rel="noreferrer"
        >
          {contact.gitHubLink}
        </a>
      </div>
    </div>
  ));

  return (
    <div className={styles.container}>
      <Card title="Money Hub foi desenvolvido por:">
        <div className={styles.contactsList}>
          {contactDetails}
        </div>
      </Card>
    </div>
  );
}

export default ContactCard;