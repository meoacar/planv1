import os
import re

def fix_params_in_file(filepath):
    """Fix params.id usage in Next.js 15 API routes"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Find all params destructuring patterns
        # Pattern: const { id } = await params or const { slug } = await params etc.
        destructure_pattern = r'const\s+\{\s*([^}]+)\s*\}\s*=\s*await\s+params'
        matches = re.findall(destructure_pattern, content)
        
        if not matches:
            return False
        
        # For each destructured variable, replace params.variable with variable
        for match in matches:
            # Split by comma to handle multiple destructured vars
            vars = [v.strip() for v in match.split(',')]
            
            for var in vars:
                # Handle cases like "id: postId" or just "id"
                if ':' in var:
                    parts = var.split(':')
                    param_name = parts[0].strip()
                    local_name = parts[1].strip()
                else:
                    param_name = var.strip()
                    local_name = var.strip()
                
                # Replace params.paramName with localName
                # Use word boundaries to avoid partial matches
                pattern = r'\bparams\.' + re.escape(param_name) + r'\b'
                content = re.sub(pattern, local_name, content)
        
        # Only write if content changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Process all TypeScript files in src/app/api"""
    api_dir = 'src/app/api'
    fixed_count = 0
    
    for root, dirs, files in os.walk(api_dir):
        for file in files:
            if file.endswith('.ts'):
                filepath = os.path.join(root, file)
                if fix_params_in_file(filepath):
                    print(f"Fixed: {filepath}")
                    fixed_count += 1
    
    print(f"\nTotal files fixed: {fixed_count}")

if __name__ == '__main__':
    main()
