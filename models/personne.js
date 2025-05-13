'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Personne extends Model {
    static associate(models) {
      // Définition des associations avec les tables Contact et Personnel
      Personne.hasOne(models.Contact, {
        foreignKey: 'personneId',
        as: 'contact'
      });
      
      Personne.hasOne(models.Personnel, {
        foreignKey: 'personneId',
        as: 'personnel'
      });
    }
  }
  
  Personne.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    date_adhesion: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Personne',
    tableName: 'personne',
    timestamps: false
  });
  
  return Personne;
};
