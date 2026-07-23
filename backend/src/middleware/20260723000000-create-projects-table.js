/**
 * 创建 projects 表迁移文件
 * 运行: npx sequelize-cli db:migrate
 * 或直接在 Supabase SQL 编辑器中执行
 */

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      project_no: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      customer: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      budget: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
        allowNull: false
      },
      spent: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
        allowNull: false
      },
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
          min: 0,
          max: 100
        }
      },
      priority: {
        type: Sequelize.ENUM('high', 'medium', 'low'),
        defaultValue: 'medium',
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('planning', 'active', 'paused', 'completed', 'cancelled'),
        defaultValue: 'planning',
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      deadline: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      project_manager: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      remark: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      }
    });
  
    // 创建索引
    await queryInterface.addIndex('projects', ['project_no']);
    await queryInterface.addIndex('projects', ['status']);
    await queryInterface.addIndex('projects', ['priority']);
    await queryInterface.addIndex('projects', ['customer']);
    await queryInterface.addIndex('projects', ['deadline']);
  }
  
  export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('projects');
  }