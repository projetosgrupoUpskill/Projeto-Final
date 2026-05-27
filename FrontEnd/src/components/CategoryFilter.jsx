import styles from "./styles/CategoryFilter.module.css";

export default function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className={styles.filterWrapper}>
      <select 
        className={styles.selectBox}
        value={activeCategory || "all"} 
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="all">Todas as Categorias</option>
        
    {categories.map(cat => (
          <option key={cat.slug || cat.id} value={cat.slug || cat.id}>
            {cat.label || cat.name} 
          </option>
        ))}
      </select>
    </div>
  );
}
