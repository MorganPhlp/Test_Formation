'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    static associate(models) {
      // Définition de l'association avec la table Personne
      Contact.belongsTo(models.Personne, {
        foreignKey: 'personneId',
        onDelete: 'CASCADE'
      });
    }
  }
  
  Contact.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    personneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Personne',
        key: 'id'
      }
    },
    adresse: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ville: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pays: {
      type: DataTypes.ENUM('FR', 'UK'),
      allowNull: false
    },
    numero_tel: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValidPhoneNumber(value) {
          // Validation simple pour le numéro de téléphone
          const frRegex = /^(\+33|0)[1-9](\d{8})$/;
          const ukRegex = /^(\+44|0)[1-9](\d{9})$/;
          
          if (this.pays === 'FR' && !frRegex.test(value.replace(/\s/g, ''))) {
            throw new Error('Le numéro de téléphone français est invalide');
          } else if (this.pays === 'UK' && !ukRegex.test(value.replace(/\s/g, ''))) {
            throw new Error('Le numéro de téléphone britannique est invalide');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Contact',
    tableName: 'contact',
    timestamps: false
  });
  
  return Contact;
};
